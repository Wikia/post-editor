import { h } from 'preact';

import './Tooltip.scss';

export default WrappedComponent => ({ position, ...rest }) => (
    <div className="pe-tooltip" style={{ left: position.left, top: position.top }}>
        <WrappedComponent {...rest} />
    </div>
);
