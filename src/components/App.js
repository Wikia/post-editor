import { h, Component } from 'preact';

import IconPopup from './IconPopup';

import './App.scss';

const NOTCH_COMPENSATION = 12;

export default class Hyperlinking extends Component {
    getComputedPosition(position) {
        return {
            top: position.bottom + NOTCH_COMPENSATION,
            left: (position.left + position.right) / 2,
        };
    }

    render({ position }) {
        return (
            <div className="pe-hyperlinking">
                <IconPopup position={this.getComputedPosition(position)} />
            </div>
        );
    }
}
