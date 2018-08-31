import { h, Component } from 'preact';

import IconTooltip from './IconTooltip';

import './HyperlinkingWrapper.scss';

const NOTCH_COMPENSATION = 20;

export default class HyperlinkingWrapper extends Component {
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
                <IconTooltip position={this.getComputedPosition(position)} />
            </div>
        );
    }
}
