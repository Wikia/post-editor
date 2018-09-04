import { Component } from 'preact';

import getTranslations from '../utils/i18n';

export default class I18nProvider extends Component {
    constructor(props) {
        super(props);

        const { language } = this.props;

        this.state = { i18n: getTranslations(language) };
    }

    getChildContext() {
        const { i18n } = this.state;

        return { i18n };
    }

    render() {
        const { children } = this.props;

        return children[0];
    }
}
