import Quill from 'quill/core';

import HyperlinkingModule from './modules/Hyperlinking';
import HighlightBlot from './blots/Highlight';

import 'quill/dist/quill.core.css';
import './styles/index.scss';

export default function create(container, options) {
    Quill.register({
        'modules/hyperlinking': HyperlinkingModule,
        'formats/highlight': HighlightBlot,
    });

    return new Quill(container, {
        modules: {
            hyperlinking: true,
        },
        ...options,
    });
}
