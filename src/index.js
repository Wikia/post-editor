import { h, render } from 'preact';
import Quill from 'quill/dist/quill.core';

import App from './components/App';

import 'quill/dist/quill.core.css';

export default function create(container, options) {
    return new Quill(container, options);
}

export const preactTest = (el) => {
    render(<App />, el);
};
