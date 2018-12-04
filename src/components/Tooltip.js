import { h } from 'preact';
import Portal from 'preact-portal';

import './Tooltip.scss';

export default WrappedComponent => ({ position, ...rest }) => (
    <Portal into="body">
        <div
            className="pe-tooltip"
            style={{ left: position.tooltip.left, top: position.tooltip.top, width: position.tooltip.width }}
            onClick={event => event.stopPropagation()}
            role="presentation"
        >
            <div className="pe-tooltip__notch" style={{ left: position.notch.left }} />
            <WrappedComponent {...rest} />
        </div>
    </Portal>
);
