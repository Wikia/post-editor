import translations from '../assets/locales/i18n';

const DEFAULT_LANG = 'en';

export default function getTranslations(lang) {
    return translations[lang.substr(0, 2).toLowerCase() || DEFAULT_LANG];
}
