import { h, Component } from 'preact';
import debounce from 'debounce';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import cls from '../utils/cls';
import callArticleTitles from '../utils/api';

import tooltip from './Tooltip';

import './InputTooltip.scss';

const DEBOUNCE_INTERVAL = 300;
const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

class InputTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLinkInvalid: false,
            isError: false,
            suggestions: [],
            selectedSuggestionIndex: -1,
        };

        this.input = null;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onSuggestionsItemMouseEnter = this.onSuggestionsItemMouseEnter.bind(this);
        this.getSuggestions = debounce(this.getSuggestions.bind(this), DEBOUNCE_INTERVAL);
    }

    componentDidMount() {
        const { isEdit } = this.props;

        if (!isEdit) {
            this.input.focus();
        }
    }

    onKeyPress(event) {
        const { linkValue } = this.props;

        if (event.key === 'Enter') {
            // Enter key may cause unexpected form submission
            event.preventDefault();

            this.accept(linkValue);
        }
    }

    onKeyDown(event) {
        const { key } = event;
        const { selectedSuggestionIndex, suggestions } = this.state;

        if (key === 'ArrowDown' && selectedSuggestionIndex < suggestions.length - 1) {
            event.preventDefault();
            this.setState({ selectedSuggestionIndex: selectedSuggestionIndex + 1 });
        } else if (key === 'ArrowUp' && selectedSuggestionIndex > -1) {
            event.preventDefault();
            this.setState({ selectedSuggestionIndex: selectedSuggestionIndex - 1 });
        }
    }

    onSuggestionsItemMouseEnter(index) {
        this.setState({
            selectedSuggestionIndex: index,
        });
    }

    onInput(event) {
        const { onInput } = this.props;
        const { isLinkInvalid } = this.state;
        const { value } = event.target;

        if (isLinkInvalid && this.isValidUrl(value)) {
            this.setState({ isLinkInvalid: false });
        }

        onInput(event);

        this.getSuggestions(value);
    }

    getSuggestions(value) {
        const { siteId } = this.props;

        // API accepts queries that are at least 3-characters long
        if (value.length < 3) {
            return;
        }

        callArticleTitles(siteId, value)
            .then(({ suggestions }) => this.setState({ suggestions }))
            .catch(() => this.setState({ isError: true }));
    }

    accept(url) {
        const { onAccept } = this.props;
        const trimmedUrl = url.trim();

        if (this.isValidUrl(trimmedUrl)) {
            onAccept(trimmedUrl);
        } else {
            this.setState({ isLinkInvalid: true });
        }
    }

    isValidUrl(url) {
        return URL_REGEX.test(url);
    }

    render() {
        const { onRemove, isEdit, linkValue } = this.props;
        const {
            isLinkInvalid,
            selectedSuggestionIndex,
            suggestions,
            isError,
        } = this.state;
        const { i18n } = this.context;

        return (
            <div className={cls('pe-input-tooltip wds-dropdown wds-no-chevron', suggestions.length && 'wds-is-active')}>
                <div className={cls('wds-input', isLinkInvalid && 'has-error')}>
                    <div className="wds-input__field-wrapper">
                        <input
                            placeholder={i18n['hyperlinking-placeholder']}
                            className="wds-input__field"
                            ref={(el) => { this.input = el; }}
                            value={linkValue}
                            onInput={this.onInput}
                            onKeyPress={this.onKeyPress}
                            onKeyDown={this.onKeyDown}
                        />
                        {isEdit && <WdsIconsTrashSmall onClick={onRemove} className="wds-icon wds-icon-small pe-input-tooltip__remove" />}
                        <WdsIconsCheckmarkSmall
                            onClick={() => this.accept(linkValue)}
                            className="wds-icon wds-icon-small pe-input-tooltip__accept"
                        />
                    </div>
                    {/* fixme error message should be different for isError = true */}
                    {(isLinkInvalid || isError) && <span className="wds-input__hint">{i18n['hyperlinking-error']}</span>}
                </div>
                <div className="pe-input-tooltip__suggestions wds-dropdown__content wds-is-not-scrollable">
                    <ul className="wds-list wds-is-linked">
                        {suggestions.map((el, index) => (<li className={selectedSuggestionIndex === index && 'wds-is-selected'} onMouseEnter={this.onSuggestionsItemMouseEnter.bind(this, index)}><a href={el.url} onClick={event => event.preventDefault()}>{el.title}</a></li>))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default tooltip(InputTooltip);
