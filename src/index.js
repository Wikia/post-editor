import Quill from 'quill/core';

import HyperlinkingModule from './modules/Hyperlinking';

import 'quill/dist/quill.core.css';

export default function create(container, options) {
    Quill.register('modules/hyperlinking', HyperlinkingModule);

    return new Quill(container, {
        modules: {
            hyperlinking: {},
        },
        ...options,
    });
}
