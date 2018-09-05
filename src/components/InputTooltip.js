import { h, Component } from 'preact';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import tooltip from './Tooltip';

import './InputTooltip.scss';

class InputTooltip extends Component {
    constructor(props) {
        super(props);

        this.input = null;

        this.onEnter = this.onEnter.bind(this);
    }

    componentDidMount() {
        this.input.focus();
    }

    onEnter(event) {
        const { onAccept } = this.props;
        const ENTER_KEY_VALUE = 'Enter';

        // keyCode/charCode is deprecated
        if (event.key === ENTER_KEY_VALUE) {
            onAccept(this.input.value);
        }
    }

    render() {
        const { onAccept, onRemove, isLinkInvalid } = this.props;

        return (
            <div className="pe-input-tooltip">
                <div className="wds-input">
                    <div className="wds-input__field-wrapper">
                        <input
                            placeholder="URL"
                            className="wds-input__field"
                            ref={(el) => { this.input = el; }}
                            onKeyPress={this.onEnter}
                        />
                        <WdsIconsTrashSmall onClick={onRemove} className="wds-icon wds-icon-small pe-input-tooltip__remove" />
                        <WdsIconsCheckmarkSmall
                            onClick={() => onAccept(this.input.value)}
                            className="wds-icon wds-icon-small pe-input-tooltip__accept"
                        />
                        {isLinkInvalid && 'error'}
                    </div>
                </div>
            </div>
        );
    }
}

export default tooltip(InputTooltip);
