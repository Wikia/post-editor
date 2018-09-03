import Inline from 'quill/blots/inline';

import './Link.scss';

const FANDOM_DOMAINS_REGEX = /(http:\/\/|https:\/\/)(([^/]+)\.)?(fandom|wikia).com/i;

export default class Link extends Inline {
    static blotName = 'link';

    static tagName = 'a';

    static create(value) {
        const node = super.create();
        let relValue = 'noreferrer noopener';

        if (!FANDOM_DOMAINS_REGEX.test(node.hostname)) {
            relValue = `${relValue} nofollow`;
        }

        node.setAttribute('href', value);
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', relValue);

        return node;
    }
}
