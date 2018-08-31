import { h, Component } from 'preact';

import IconPopup from './IconPopup';

import './HyperlinkingWrapper.scss';

const NOTCH_COMPENSATION = 20;

export default class Hyperlinking extends Component {
    getComputedPosition(position) {
        return {
            top: position.bottom + NOTCH_COMPENSATION,
            left: (position.left + position.right) / 2,
        };
    }

    render() {
        const { position } = this.props;

        return (
            <div className="pe-hyperlinking">
                <IconPopup position={this.getComputedPosition(position)} />
            </div>
        );
    }
}
