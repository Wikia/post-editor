import { Component } from 'preact';

import getTranslations from '../utils/i18n';

export default class I18nProvider extends Component {
    getChildContext() {
        const { language } = this.props;

        return { i18n: getTranslations(language) };
    }

    render() {
        const { children } = this.props;

        return children[0];
    }
}
