import { h, Component } from 'preact';

import './App.scss';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicks: 0,
        };
    }

    onClick() {
        this.setState(({ clicks }) => ({ clicks: clicks + 1 }));
    }

    render() {
        const { clicks } = this.state;

        return (
            <div className="test-class">
                <h1 role="presentation" onClick={() => this.onClick()}>
                    Hai! {clicks}
                </h1>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                >
                    Click me now
                </a>
            </div>
        );
    }
}
