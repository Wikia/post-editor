import Quill from 'quill/core';
import { h, Component } from 'preact';

import Highlight from '../blots/Highlight';
import Link from '../blots/Link';

import I18nProvider from './I18nProvider';
import HyperlinkingWrapper from './HyperlinkingWrapper';

import 'quill/dist/quill.core.css';
import './PostEditor.scss';
import TrackingProvider from './TrackingProvider';

Quill.register({
    'formats/highlight': Highlight,
    'formats/link': Link,
});

export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        this.quillContainer = null;
        this.postEditorWrapper = null;
        this.state = {
            quill: null,
        };
    }

    componentDidMount() {
        const { onCreate, quillConfig } = this.props;
        const quill = new Quill(this.quillContainer, quillConfig);

        this.setState({
            quill,
        });

        onCreate({
            quill,
            getHTML: () => quill.root.innerHTML,
            setHTML: (html) => {
                quill.root.innerHTML = html;
            },
        });
    }

    render() {
        const { quill } = this.state;
        const { language, suggestionsApiUrl, onTrack } = this.props;

        return (
            <TrackingProvider onTrack={onTrack}>
                <I18nProvider language={language}>
                    <div className="pe-wrapper" ref={(el) => { this.postEditorWrapper = el; }}>
                        <div className="pe-quill-container" ref={(el) => { this.quillContainer = el; }} />
                        {quill && <HyperlinkingWrapper quill={quill} postEditorWrapper={this.postEditorWrapper} suggestionsApiUrl={suggestionsApiUrl} />}
                    </div>
                </I18nProvider>
            </TrackingProvider>
        );
    }
}

PostEditor.defaultProps = {
    onCreate: () => null,
    language: '',
    quillConfig: {},
};
