import { h, render } from 'preact';

import App from '../components/App';

export default class Hyperlinking {
    constructor(quill) {
        this.quill = quill;

        this.quill.on('selection-change', this.onSelection.bind(this));
    }

    onSelection(range) {
        if (range) {
            if (range.length > 0) {
                const selectionPosition = this.quill.getBounds(range.index, range.length);

                render(<App position={selectionPosition} />, this.quill.container, this.quill.container.lastChild);
            } else {
                render(null, this.quill.container, this.quill.container.lastChild);
            }
        }
    }
}
