import { h } from 'preact';
import WdsIconsLink from 'design-system/dist/svg/wds-icons-link.svg';

import tooltip from './Tooltip';

import './IconTooltip.scss';

const IconPopup = ({ onClick }) => (
    <WdsIconsLink onClick={onClick} className="wds-icon pe-icon-tooltip" />
);

export default tooltip(IconPopup);
