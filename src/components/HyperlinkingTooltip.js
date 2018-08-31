import { h, Component } from 'preact';

import IconTooltip from './IconTooltip';

import './HyperlinkingTooltip.scss';

const NOTCH_COMPENSATION = 12;

export default class HyperlinkingTooltip extends Component {
    getComputedPosition(position) {
        return {
            top: position.bottom + NOTCH_COMPENSATION,
            left: (position.left + position.right) / 2,
        };
    }

    render({ position }) {
        return (
            <div className="pe-hyperlinking">
                <IconTooltip position={this.getComputedPosition(position)} />
            </div>
        );
    }
}
