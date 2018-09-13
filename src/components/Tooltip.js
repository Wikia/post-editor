import { h } from 'preact';

import './Tooltip.scss';

export default WrappedComponent => ({ position, ...rest }) => (
    <div className="pe-tooltip" style={{ left: position.tooltip.left, top: position.tooltip.top, width: position.tooltip.width }}>
        <div className="pe-tooltip__notch" style={{ left: position.notch.left }} />
        <WrappedComponent {...rest} />
    </div>
);
