import { h, render } from 'preact';

import HyperlinkingTooltip from '../components/HyperlinkingTooltip';

export default class Hyperlinking {
    constructor(quill) {
        this.quill = quill;

        this.quill.on('selection-change', this.onSelection.bind(this));
    }

    onSelection(range) {
        if (range) {
            if (range.length > 0) {
                const selectionPosition = this.quill.getBounds(range.index, range.length);

                render(
                    <HyperlinkingTooltip position={selectionPosition} />,
                    this.quill.container,
                    this.quill.container.lastChild,
                );

                this.quill.format('highlight', true);
            } else {
                render(null, this.quill.container, this.quill.container.lastChild);

                this.quill.formatText(0, this.quill.getLength(), 'highlight', false);
            }
        }
    }
}
