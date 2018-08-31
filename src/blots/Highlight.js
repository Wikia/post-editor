import Inline from 'quill/blots/inline';

import './Highlight.scss';

export default class Highlight extends Inline {
    static blotName = 'highlight';

    static className = 'pe-highlight';

    // Span is broken, see https://github.com/quilljs/quill/issues/1866
    static tagName = 'strong';
}
