import Inline from 'quill/blots/inline';

import './Highlight.scss';

export default class Highlight extends Inline {
    static blotName = 'highlight';

    static className = 'pe-highlight';

    static tagName = 'strong';
}
