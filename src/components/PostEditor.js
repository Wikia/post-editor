import Quill from 'quill/core';
import { h, Component } from 'preact';

import Highlight from '../blots/Highlight';
import Link from '../blots/Link';

import HyperlinkingWrapper from './HyperlinkingWrapper';

import 'quill/dist/quill.core.css';
import './PostEditor.scss';

Quill.register({
    'formats/highlight': Highlight,
    'formats/link': Link,
});

const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

/* eslint-disable no-alert */
export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        this.quillContainer = null;
        this.quill = null;
        this.state = {
            currentSelection: null,
            isLinkInvalid: false,
        };

        this.insertLink = this.insertLink.bind(this);
    }

    componentDidMount() {
        const { options } = this.props;

        this.setupQuill(options);
    }

    onSelection(range) {
        if (range) {
            if (range.length > 0) {
                this.setState({ currentSelection: this.quill.getBounds(range.index, range.length) });
                this.quill.format('highlight', true);
            } else {
                this.setState({ currentSelection: null, isLinkInvalid: false });
                this.quill.formatText(0, this.quill.getLength(), 'highlight', false);
            }
        }
    }

    setupQuill(options) {
        this.quill = new Quill(this.quillContainer, options);

        this.quill.on('selection-change', this.onSelection.bind(this));
    }

    insertLink(url) {
        if (URL_REGEX.test(url)) {
            this.quill.format('link', url);

            this.setState({ currentSelection: null, isLinkInvalid: false });
        } else {
            this.setState({ isLinkInvalid: true });
        }
    }

    render() {
        const { currentSelection, isLinkInvalid } = this.state;

        return (
            <div className="pe-wrapper">
                <div className="pe-quill-container" ref={(el) => { this.quillContainer = el; }} />
                {currentSelection && <HyperlinkingWrapper position={currentSelection} />}
                <button type="button" onClick={() => this.insertLink(prompt('DEJ LINK'))}>
                    Highlight a link and click me {isLinkInvalid && 'Your link is invalid 🙈🙈🙈'}
                </button>
            </div>
        );
    }
}
