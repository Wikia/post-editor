import { h } from 'preact';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import tooltip from './Tooltip';

import './InputTooltip.scss';

const InputTooltip = ({ onAccept, onRemove }) => (
    <div className="pe-input-tooltip">
        <div className="wds-input">
            <div className="wds-input__field-wrapper">
                <input placeholder="URL" className="wds-input__field" />
                <WdsIconsTrashSmall onClick={onRemove} className="wds-icon wds-icon-small pe-input-tooltip__remove" />
                <WdsIconsCheckmarkSmall onClick={onAccept} className="wds-icon wds-icon-small pe-input-tooltip__accept" />
            </div>
        </div>
    </div>
);

export default tooltip(InputTooltip);
