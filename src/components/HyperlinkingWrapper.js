import { h, Component } from 'preact';

import IconTooltip from './IconTooltip';
import InputTooltip from './InputTooltip';

import './HyperlinkingWrapper.scss';

const NOTCH_COMPENSATION = 20;
const HYPERLINKING_STATE = {
    INITIAL: null,
    CREATE: 'CREATE',
    EDIT: 'EDIT',
};

const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

export default class HyperlinkingWrapper extends Component {
    static getComputedPosition(position) {
        return {
            top: position.bottom + NOTCH_COMPENSATION,
            left: (position.left + position.right) / 2,
        };
    }

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
                this.setState({ currentSelection: this.quill.getBounds(range.index, range.length) });
                this.quill.format('highlight', true);
            }
        }
    }

    onClose() {
        this.setState({ currentSelection: null, isLinkInvalid: false, current: HYPERLINKING_STATE.INITIAL });
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
        this.onClose();
    }

    renderTooltip() {
        const { current, isLinkInvalid, currentSelection } = this.state;
        const isEdit = current === HYPERLINKING_STATE.EDIT;
        const computedPosition = HyperlinkingWrapper.getComputedPosition(currentSelection);

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
