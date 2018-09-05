import translations from '../assets/locales/i18n';

const DEFAULT_LANG = 'en';

export default function getTranslations(lang) {
    const lowerCasedLang = lang.toLowerCase();

    return translations[lowerCasedLang] || translations[lowerCasedLang.substr(0, 2)] || translations[DEFAULT_LANG];
}
