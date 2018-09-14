import Inline from 'quill/blots/inline';

const FANDOM_DOMAINS_REGEX = /(fandom|wikia).com/i;

export default class Link extends Inline {
    static blotName = 'link';

    static tagName = 'a';

    static create(value) {
        const node = super.create();
        let relValue = 'noreferrer noopener';

        node.setAttribute('href', Link.getNormalizedUrl(value));

        if (!FANDOM_DOMAINS_REGEX.test(node.hostname)) {
            relValue = `${relValue} nofollow`;
        }

        node.setAttribute('target', '_blank');
        node.setAttribute('rel', relValue);

        return node;
    }

    static formats(node) {
        return node.getAttribute('href') || true;
    }

    static getNormalizedUrl(url) {
        return !url.match(/^https?:\/\//) ? `http://${url}` : url;
    }

    format(name, value) {
        if (name === 'active' && value) {
            this.domNode.classList.add('pe-highlight');
        } else {
            this.domNode.classList.remove('pe-highlight');
        }

        super.format(name, value);
    }
}
