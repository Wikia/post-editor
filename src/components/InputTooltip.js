import { h, Component } from 'preact';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import tooltip from './Tooltip';

import './InputTooltip.scss';

class InputTooltip extends Component {
    constructor(props) {
        super(props);

        this.input = null;
    }

    render() {
        const { onAccept, onRemove, isLinkInvalid, linkValue } = this.props;

        return (
            <div className="pe-input-tooltip">
                <div className="wds-input">
                    <div className="wds-input__field-wrapper">
                        <input placeholder="URL" className="wds-input__field" ref={(el) => { this.input = el; }} value={linkValue} />
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
