import Inline from 'quill/blots/inline';

export default class Blockquote extends Inline {
    static blotName = 'blockquote';

    static tagName = 'blockquote';

    static formats(node) {
        node.setAttribute('contenteditable', false);
    }
}
