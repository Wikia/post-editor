import { h, render } from 'preact';

import PostEditor from './components/PostEditor';

export default function create(container, options) {
    return render(<PostEditor options={options} />, container);
}
