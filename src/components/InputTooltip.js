import { h, Component } from 'preact';
import debounce from 'debounce';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import cls from '../utils/cls';
import getArticleTitles from '../utils/api';

import tooltip from './Tooltip';

import './InputTooltip.scss';

const DEBOUNCE_INTERVAL = 300;
const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

class InputTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLinkInvalid: false,
            suggestions: [],
            selectedSuggestionIndex: -1,
            cachedResults: {},
            isFocused: false,
            isEscaped: false,
        };

        this.input = null;
        this.suggestionsListClicked = false;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onSuggestionsItemMouseEnter = this.onSuggestionsItemMouseEnter.bind(this);
        this.getSuggestions = debounce(this.getSuggestions.bind(this), DEBOUNCE_INTERVAL);
    }

    componentDidMount() {
        const { isEdit } = this.props;

        if (!isEdit) {
            this.setState({ isFocused: true });
            this.input.focus();
        }
    }

    onKeyPress(event) {
        const { linkHref } = this.props;

        if (event.key === 'Enter') {
            // Enter key may cause unexpected form submission
            event.preventDefault();

            this.accept(linkHref);
        }
    }

    onKeyDown(event) {
        const { key } = event;
        const { onClose } = this.props;
        const { selectedSuggestionIndex, suggestions } = this.state;

        if (key === 'ArrowDown' && selectedSuggestionIndex < suggestions.length - 1) {
            event.preventDefault();
            this.setState({ selectedSuggestionIndex: selectedSuggestionIndex + 1 });
        } else if (key === 'ArrowUp' && selectedSuggestionIndex > -1) {
            event.preventDefault();
            this.setState({ selectedSuggestionIndex: selectedSuggestionIndex - 1 });
        } else if (key === 'Escape') {
            if (suggestions.length) {
                this.setState({
                    isEscaped: true,
                });
            } else {
                onClose();
            }
        }
    }

    onSuggestionsItemMouseEnter(index) {
        this.setState({
            selectedSuggestionIndex: index,
        });
    }

    onInput({ target: { value } }) {
        const { onLinkChange } = this.props;
        const { isLinkInvalid } = this.state;

        if (isLinkInvalid && this.isValidUrl(value)) {
            this.setState({ isLinkInvalid: false });
        }

        this.setState({
            isEscaped: false,
        });

        onLinkChange(value);

        this.getSuggestions(value);
    }

    onBlur() {
        if (!this.suggestionsListClicked) {
            this.setState({
                isFocused: false,
            });
        }
    }

    onFocus() {
        this.setState({
            isFocused: true,
        });
    }

    getSuggestions(query) {
        const { suggestionsApiUrl } = this.props;
        const { cachedResults } = this.state;

        // API accepts queries that are at least 3-characters long
        if (query.length < 3) {
            this.setState({ suggestions: [] });

            return;
        }

        if (cachedResults[query]) {
            this.setState({ suggestions: cachedResults[query] });
        } else {
            getArticleTitles(suggestionsApiUrl, query)
                .then(({ suggestions }) => {
                    this.setState(prevState => ({
                        suggestions,
                        cachedResults: {
                            ...prevState.cachedResults,
                            [query]: suggestions,
                        },
                    }));
                });
        }
    }

    setSuggestionsListClicked(value) {
        this.suggestionsListClicked = value;
    }

    splitText(textToSplit, query) {
        const queryLowerCase = query.trim()
            .toLowerCase();
        const matchedIndex = textToSplit.toLowerCase()
            .indexOf(queryLowerCase);
        const before = textToSplit.substr(0, matchedIndex);
        const match = textToSplit.substr(matchedIndex, queryLowerCase.length);
        const after = textToSplit.substr(matchedIndex + queryLowerCase.length);

        return matchedIndex === -1 ? { before: textToSplit } : { before, match, after };
    }

    accept(providedUrl) {
        const { onAccept, linkTitle } = this.props;
        const { selectedSuggestionIndex, suggestions } = this.state;
        const trimmedUrl = selectedSuggestionIndex === -1 ? providedUrl.trim() : suggestions[selectedSuggestionIndex].url;
        const title = selectedSuggestionIndex === -1 ? linkTitle : suggestions[selectedSuggestionIndex].title;

        if (this.isValidUrl(trimmedUrl)) {
            onAccept(trimmedUrl, title);
        } else {
            this.setState({ isLinkInvalid: true });
        }
    }

    isValidUrl(url) {
        return URL_REGEX.test(url);
    }

    renderSuggestions() {
        const { selectedSuggestionIndex, suggestions } = this.state;
        const { linkHref } = this.props;

        return suggestions.map(({ url, title }, index) => {
            const { before, match, after } = this.splitText(title, linkHref);

            return (
                <li
                    className={selectedSuggestionIndex === index && 'wds-is-selected'}
                    onMouseEnter={this.onSuggestionsItemMouseEnter.bind(this, index)}
                    key={url}
                >
                    <a
                        href={url}
                        onClick={(event) => {
                            event.preventDefault();
                            this.accept(url);
                        }}
                    >
                        {before}{match && <strong>{match}</strong>}{after}
                    </a>
                </li>
            );
        });
    }

    render() {
        const {
            onRemove,
            isEdit,
            linkHref,
            linkTitle,
        } = this.props;
        const {
            isLinkInvalid,
            suggestions,
            isFocused,
            isEscaped,
        } = this.state;
        const { i18n } = this.context;
        const valueToDisplay = linkTitle || linkHref;
        const shouldShowDropdown = suggestions.length && isFocused && !isEscaped;

        return (
            <div
                className={cls('pe-input-tooltip wds-dropdown wds-no-chevron', shouldShowDropdown && 'wds-is-active')}
            >
                <div className={cls('wds-input', isLinkInvalid && 'has-error')}>
                    <div className="wds-input__field-wrapper">
                        <input
                            placeholder={i18n['hyperlinking-placeholder']}
                            className="wds-input__field"
                            ref={(el) => {
                                this.input = el;
                            }}
                            value={valueToDisplay}
                            onInput={this.onInput}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            onKeyPress={this.onKeyPress}
                            onKeyDown={this.onKeyDown}
                        />
                        {isEdit && (
                            <WdsIconsTrashSmall
                                onClick={onRemove}
                                className="wds-icon wds-icon-small pe-input-tooltip__remove"
                            />
                        )}
                        <WdsIconsCheckmarkSmall
                            onClick={() => this.accept(linkHref)}
                            className="wds-icon wds-icon-small pe-input-tooltip__accept"
                        />
                    </div>
                    {isLinkInvalid && <span className="wds-input__hint">{i18n['hyperlinking-error']}</span>}
                </div>
                {linkHref && (
                    <div
                        className="pe-input-tooltip__suggestions wds-dropdown__content wds-is-not-scrollable"
                        role="presentation"
                        onMouseDown={this.setSuggestionsListClicked.bind(this, true)}
                        onMouseUp={this.setSuggestionsListClicked.bind(this, false)}
                    >
                        <ul className="wds-list wds-is-linked">
                            {this.renderSuggestions()}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default tooltip(InputTooltip);
