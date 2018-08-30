import { h } from 'preact';
import WdsAvatarIconUser from 'design-system/dist/svg/wds-icons-link.svg';

import './IconPopup.scss';

const IconPopup = ({ position }) => (
    <div className="pe-icon-popup" style={{ left: position.left, top: position.top }}>
        <WdsAvatarIconUser />
    </div>
);

export default IconPopup;
