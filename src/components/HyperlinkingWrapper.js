import { h, Component } from 'preact';

import { Range } from 'quill/core/selection';

import IconTooltip from './IconTooltip';
import InputTooltip from './InputTooltip';

import './HyperlinkingWrapper.scss';

const NOTCH_COMPENSATION = 20;
const INPUT_TOOLTIP_WIDTH = 320;
const ICON_TOOLTIP_WIDTH = 48; // 24px (.wds-icon) + 2 * 12px (padding of .pe-tooltip)
const HYPERLINKING_STATE = {
    INITIAL: null,
    CREATE: 'CREATE',
    EDIT: 'EDIT',
};

const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
const AUTOSELECT_BLOT_TYPES = ['link'];

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
            currentSelection: null,
            isLinkInvalid: false,
        };

        this.quill.on('selection-change', this.onSelection.bind(this));
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocumentClick);
    }

    onDocumentClick(event) {
        const { currentSelection } = this.state;

        if (!event.target.closest('.pe-hyperlinking') && currentSelection) {
            this.onClose();
        }
    }

    onSelection(range) {
        if (range) {
            if (range.length > 0) {
                const lines = this.quill.getLines(range.index, range.length);
                const selectionFormat = this.quill.getFormat();
                let currentSelection;

                // gets bounds for last selected line
                if (lines.length === 1) {
                    currentSelection = this.quill.getBounds(range);
                } else {
                    const lastLine = lines[lines.length - 1];
                    const index = this.quill.getIndex(lastLine);
                    const length = Math.min(
                        lastLine.length() - 1,
                        range.index + range.length - index,
                    );

                    currentSelection = this.quill.getBounds(new Range(index, length));
                }

                this.setState({ currentSelection, selectionFormat });
                this.quill.format('highlight', true);
            } else {
                const [blot, blotRange] = this.getBlotFromIndex(range.index);
                const allowAutoselect = AUTOSELECT_BLOT_TYPES.indexOf(blot.statics.blotName) !== -1;

                if (allowAutoselect) {
                    this.quill.setSelection(blotRange);
                }
            }
        }
    }

    onClose() {
        this.setState({
            currentSelection: null,
            isLinkInvalid: false,
            selectionFormat: {},
            current: HYPERLINKING_STATE.INITIAL,
        });
        this.quill.formatText(0, this.quill.getLength(), 'highlight', false);
    }

    onCreate() {
        this.setState({
            current: HYPERLINKING_STATE.CREATE,
        });
    }

    onAccept(url) {
        if (URL_REGEX.test(url)) {
            this.quill.format('link', url);

            this.setState({ currentSelection: null, isLinkInvalid: false });
            this.onClose();
        } else {
            this.setState({ isLinkInvalid: true });
        }
    }

    onRemove() {
        this.quill.format('link', undefined);
        this.onClose();
    }

    getBlotFromIndex(index) {
        const [blot, blotOffset] = this.quill.getLeaf(index);

        return [blot.parent, new Range(index - blotOffset, blot.length())];
    }

    getComputedPosition(position) {
        const { current } = this.state;
        const { offsetLeft, offsetTop } = this.quill.root.parentElement;
        const centerOfSelection = (position.left + position.right) / 2;
        const width = (current === HYPERLINKING_STATE.INITIAL) ? ICON_TOOLTIP_WIDTH : INPUT_TOOLTIP_WIDTH;
        const defaultLeft = centerOfSelection - width / 2 + offsetLeft;
        const left = Math.max(0, defaultLeft);
        const notchLeft = left !== defaultLeft ? width / 2 + defaultLeft : '50%';

        return {
            tooltip: {
                top: position.bottom + NOTCH_COMPENSATION + offsetTop,
                left,
            },
            notch: {
                left: notchLeft,
            },
        };
    }

    renderTooltip() {
        const {
            current,
            isLinkInvalid,
            currentSelection,
            selectionFormat,
        } = this.state;
        const isEdit = current === HYPERLINKING_STATE.EDIT;
        const computedPosition = this.getComputedPosition(currentSelection);
        const linkValue = Array.isArray(selectionFormat.link) ? null : selectionFormat.link;

        return !current ? (
            <IconTooltip
                position={computedPosition}
                onClick={this.onCreate}
            />
        ) : (
            <InputTooltip
                position={computedPosition}
                isEdit={isEdit}
                isLinkInvalid={isLinkInvalid}
                linkValue={linkValue}
                onAccept={this.onAccept}
                onRemove={this.onRemove}
            />
        );
    }

    render() {
        const { currentSelection } = this.state;

        if (!currentSelection) {
            return null;
        }

        return (
            <div className="pe-hyperlinking">
                {this.renderTooltip()}
            </div>
        );
    }
}
