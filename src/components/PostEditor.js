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
        const { options } = this.props;

        this.setState({
            quill: new Quill(this.quillContainer, options),
        });
    }

    render() {
        const { quill } = this.state;
        const { language } = this.props;

        return (
            <I18nProvider language={language}>
                <div className="pe-wrapper">
                    <div className="pe-quill-container" ref={(el) => { this.quillContainer = el; }} />
                    {quill && <HyperlinkingWrapper quill={quill} />}
                </div>
            </I18nProvider>
        );
    }
}
