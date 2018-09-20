import { Component } from 'preact';

export default class TrackingProvider extends Component {
    getChildContext() {
        const { onTrack } = this.props;

        return { track: onTrack };
    }

    render() {
        const { children } = this.props;

        return children[0];
    }
}
