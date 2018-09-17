import Quill from 'quill/core';
import { h, Component } from 'preact';

import Highlight from '../blots/Highlight';
import Link from '../blots/Link';

import I18nProvider from './I18nProvider';
import HyperlinkingWrapper from './HyperlinkingWrapper';

import 'quill/dist/quill.core.css';
import './PostEditor.scss';

Quill.register({
    'formats/highlight': Highlight,
    'formats/link': Link,
});

export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        this.quillContainer = null;
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
        const { language, suggestionsApiUrl } = this.props;

        return (
            <I18nProvider language={language}>
                <div className="pe-wrapper">
                    <div className="pe-quill-container" ref={(el) => { this.quillContainer = el; }} />
                    {quill && <HyperlinkingWrapper quill={quill} suggestionsApiUrl={suggestionsApiUrl} />}
                </div>
            </I18nProvider>
        );
    }
}

PostEditor.defaultProps = {
    onCreate: () => null,
    language: '',
    quillConfig: {},
};
