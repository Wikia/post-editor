import { h, render } from 'preact';

import PostEditor from './components/PostEditor';

// fixme we shouldn't import it here
import 'design-system/dist/scss/index.scss';

export default function create(container, options) {
    return render(<PostEditor options={options} />, container);
}
