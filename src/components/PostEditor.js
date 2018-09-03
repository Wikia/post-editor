import Quill from 'quill/core';
import { h, Component } from 'preact';

import Highlight from '../blots/Highlight';

import HyperlinkingWrapper from './HyperlinkingWrapper';

import 'quill/dist/quill.core.css';
import './PostEditor.scss';

Quill.register({ 'formats/highlight': Highlight });

export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        this.onHyperlinkingClose = this.onHyperlinkingClose.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);

        this.quillContainer = null;
        this.quill = null;
        this.state = {
            currentSelection: null,
        };
    }

    componentDidMount() {
        const { options } = this.props;

        this.setupQuill(options);
        document.addEventListener('mousedown', this.onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocumentClick);
    }

    onDocumentClick(event) {
        const { currentSelection } = this.state;

        if (!event.target.closest('.pe-hyperlinking') && currentSelection) {
            this.onHyperlinkingClose();
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

    onHyperlinkingClose() {
        this.setState({ currentSelection: null });
        this.quill.formatText(0, this.quill.getLength(), 'highlight', false);
    }

    setupQuill(options) {
        this.quill = new Quill(this.quillContainer, options);

        this.quill.on('selection-change', this.onSelection.bind(this));
    }

    render() {
        const { currentSelection } = this.state;

        return (
            <div className="pe-wrapper">
                <div id="pe-quill-container" ref={(el) => { this.quillContainer = el; }} />
                {currentSelection && <HyperlinkingWrapper position={currentSelection} onClose={this.onHyperlinkingClose} />}
            </div>
        );
    }
}
