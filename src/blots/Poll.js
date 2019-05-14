import {BlockEmbed} from 'quill/blots/block';

import './Poll.scss';

export default class Poll extends BlockEmbed {
    static blotName = 'poll';

    static className = 'pe-poll';

    static tagName = 'div';

    static create(id) {
        let node = super.create();
        // node.setAttribute('alt', value.alt);
        node.setAttribute('contenteditable', false);
        node.dataset.id = id;
        return node;
    }

    static value(node) {
        return node.dataset.id;
    }
}
