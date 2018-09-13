import { h, Component } from 'preact';

import { Range } from 'quill/core/selection';

import IconTooltip from './IconTooltip';
import InputTooltip from './InputTooltip';

import './HyperlinkingWrapper.scss';

const NOTCH_COMPENSATION = 20;
const INPUT_TOOLTIP_WIDTH = 320;
const ICON_TOOLTIP_WIDTH = 48; // 24px (.wds-icon) + 2 * 12px (padding of .pe-tooltip)
const MIN_OFFSET = 3; // add minimum 3px offset from the left or right edge
const HYPERLINKING_STATE = {
    INITIAL: null,
    CREATE: 'CREATE',
    EDIT: 'EDIT',
};

export default class HyperlinkingWrapper extends Component {
    constructor(props) {
        super(props);

        this.quill = props.quill;

        this.onCreate = this.onCreate.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);

        this.state = {
            current: HYPERLINKING_STATE.INITIAL,
            selectionBounds: null,
            linkValue: '',
        };

        this.quill.on('selection-change', this.onSelection.bind(this));
        this.quill.on('text-change', this.onTextChange.bind(this));
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocumentClick);
    }

    onDocumentClick(event) {
        const { selectionBounds } = this.state;

        if (!event.target.closest('.pe-hyperlinking') && selectionBounds) {
            this.onClose();
        }
    }

    onTextChange(delta, oldContents, source) {
        const { current } = this.state;

        /**
         * close hyperlinking tooltip when user starts typing while creating a link
         * that prevents highlighting the text when user starts typing when text is selected
         */
        if (current !== HYPERLINKING_STATE.EDIT && source === 'user') {
            this.onClose();
        }
    }

    onSelection(range) {
        if (range) {
            if (range.length > 0) {
                const lines = this.quill.getLines(range.index, range.length);

                let selectionBounds;

                // gets bounds for last selected line
                if (lines.length === 1) {
                    selectionBounds = this.quill.getBounds(range);
                } else {
                    const lastLine = lines[lines.length - 1];
                    const index = this.quill.getIndex(lastLine);
                    const length = Math.min(
                        lastLine.length() - 1,
                        range.index + range.length - index,
                    );

                    selectionBounds = this.quill.getBounds(new Range(index, length));
                }

                this.setState({ selectionBounds });

                /**
                 * on mobile it is possible to create new selection without removing old one first
                 * to prevent creating multiple highlights we need to reset all of them and then add new
                 */
                this.resetHighlighting();

                this.quill.format('highlight', true);
            } else {
                const [blotToEdit, blotRange] = this.getBlotFromIndex(range.index);

                if (blotToEdit.statics.blotName === 'link') {
                    const linkValue = blotToEdit.formats().link;

                    blotToEdit.format('active', true);

                    this.setState({
                        blotToEdit,
                        current: HYPERLINKING_STATE.EDIT,
                        linkValue,
                        selectionBounds: this.quill.getBounds(blotRange),
                    });
                } else {
                    this.onClose();
                }
            }
        }
    }

    onClose() {
        const { blotToEdit } = this.state;

        if (blotToEdit) {
            blotToEdit.format('active', false);
        }

        this.setState({
            selectionBounds: null,
            current: HYPERLINKING_STATE.INITIAL,
            linkValue: '',
            blotToEdit: undefined,
        });
        this.resetHighlighting();
    }

    onCreate() {
        this.setState({
            current: HYPERLINKING_STATE.CREATE,
        });
    }

    onAccept(url) {
        this.formatLink(url);
        this.onClose();
    }

    onRemove() {
        this.formatLink(undefined);
        this.onClose();
    }

    getBlotFromIndex(index) {
        const [blot, blotOffset] = this.quill.getLeaf(index);

        return [blot.parent, new Range(index - blotOffset, blot.length())];
    }

    getComputedWidth() {
        const { current } = this.state;
        const { offsetWidth } = this.quill.root.parentElement;
        const defaultWidth = (current === HYPERLINKING_STATE.INITIAL) ? ICON_TOOLTIP_WIDTH : INPUT_TOOLTIP_WIDTH;
        // tooltip should not be wider than width of the editor minus offset
        const maxWidth = offsetWidth - 2 * MIN_OFFSET;

        return Math.min(defaultWidth, maxWidth);
    }

    getComputedTop(bottom) {
        const { offsetTop } = this.quill.root.parentElement;

        return bottom + NOTCH_COMPENSATION + offsetTop;
    }

    getComputedLeft(defaultLeft, width) {
        const { offsetWidth } = this.quill.root.parentElement;
        const maxLeft = offsetWidth - width - MIN_OFFSET;

        return Math.max(MIN_OFFSET, Math.min(defaultLeft, maxLeft));
    }

    getComputedNotchLeft(defaultLeft, left, width) {
        const leftDiff = defaultLeft - left;

        // add minimum 10px offset (8px compensation of negative left margin plus 2px border-radius of tooltip)
        return left !== defaultLeft ? Math.max(10, Math.min(width / 2 + leftDiff, width - 10)) : '50%';
    }

    getComputedPosition(position) {
        const { offsetLeft } = this.quill.root.parentElement;
        const centerOfSelection = (position.left + position.right) / 2;
        const width = this.getComputedWidth();
        const defaultLeft = centerOfSelection - width / 2 + offsetLeft;
        const left = this.getComputedLeft(defaultLeft, width);
        const top = this.getComputedTop(position.bottom);

        return {
            tooltip: {
                left,
                top,
                width,
            },
            notch: {
                left: this.getComputedNotchLeft(defaultLeft, left, width),
            },
        };
    }

    formatLink(url) {
        const { blotToEdit } = this.state;
        const objectToFormat = blotToEdit || this.quill;

        objectToFormat.format('link', url);
    }

    resetHighlighting() {
        this.quill.formatText(0, this.quill.getLength(), 'highlight', false);
    }

    renderTooltip() {
        const {
            current,
            selectionBounds,
            linkValue,
        } = this.state;
        const isEdit = current === HYPERLINKING_STATE.EDIT;
        const computedPosition = this.getComputedPosition(selectionBounds);

        return !current ? (
            <IconTooltip
                position={computedPosition}
                onClick={this.onCreate}
            />
        ) : (
            <InputTooltip
                position={computedPosition}
                isEdit={isEdit}
                linkValue={linkValue}
                onAccept={this.onAccept}
                onRemove={this.onRemove}
            />
        );
    }

    render() {
        const { selectionBounds } = this.state;

        if (!selectionBounds) {
            return null;
        }

        return (
            <div className="pe-hyperlinking">
                {this.renderTooltip()}
            </div>
        );
    }
}
