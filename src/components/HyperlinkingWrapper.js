import { h, Component } from 'preact';

import IconTooltip from './IconTooltip';
import InputTooltip from './InputTooltip';

import './HyperlinkingWrapper.scss';

const NOTCH_COMPENSATION = 20;

export default class HyperlinkingWrapper extends Component {
    static getComputedPosition(position) {
        return {
            top: position.bottom + NOTCH_COMPENSATION,
            left: (position.left + position.right) / 2,
        };
    }

    constructor(props) {
        super(props);

        this.create = this.create.bind(this);
        this.accept = this.accept.bind(this);
        this.remove = this.remove.bind(this);

        this.state = {
            current: null,
        };
    }

    create() {
        this.setState({
            current: 'create',
        });
    }

    accept() {
        // TODO
        const { onClose } = this.props;

        onClose();
    }

    remove() {
        // TODO
        const { onClose } = this.props;

        onClose();
    }

    render() {
        const { position } = this.props;
        const { current } = this.state;
        const isEdit = current === 'edit';
        const computedPosition = HyperlinkingWrapper.getComputedPosition(position);
        const tooltip = !current ? (
            <IconTooltip
                position={computedPosition}
                onLinkClick={this.create}
            />
        ) : (
            <InputTooltip
                position={computedPosition}
                isEdit={isEdit}
                onAccept={this.accept}
                onRemove={this.remove}
            />
        );

        return (
            <div className="pe-hyperlinking">
                {tooltip}
            </div>
        );
    }
}