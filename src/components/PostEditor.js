import Quill from 'quill/core';
import { h, Component } from 'preact';

import HyperlinkingWrapper from './HyperlinkingWrapper';

import 'quill/dist/quill.core.css';

export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        this.quillContainer = null;
        this.quill = null;
        this.state = {
            currentSelection: null,
        };
    }

    componentDidMount() {
        const { options } = this.props;

        this.setupQuill(options);
    }

    onSelection(range) {
        if (range && range.length > 0) {
            this.setState({ currentSelection: this.quill.getBounds(range.index, range.length) });
        } else {
            this.setState({ currentSelection: null });
        }
    }

    setupQuill(options) {
        this.quill = new Quill(this.quillContainer, options);

        this.quill.on('selection-change', this.onSelection.bind(this));
    }

    render() {
        const { currentSelection } = this.state;

        return (
            <div className="pe-wrapper">
                <div id="pe-quill-container" ref={(el) => { this.quillContainer = el; }} />
                {currentSelection && <HyperlinkingWrapper position={currentSelection} />}
            </div>
        );
    }
}
