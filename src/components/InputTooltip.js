import { h, Component } from 'preact';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import cls from '../utils/cls';
import callArticleTitles from '../utils/api';

import tooltip from './Tooltip';

import './InputTooltip.scss';

const ENTER_KEY = 'Enter';
const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

class InputTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLinkInvalid: false,
            suggestions: [],
            selectedSuggestionIndex: -1,
        };

        this.input = null;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onSuggestionsItemMouseEnter = this.onSuggestionsItemMouseEnter.bind(this);
    }

    componentDidMount() {
        const { isEdit } = this.props;

        if (!isEdit) {
            this.input.focus();
        }
    }

    onKeyPress(event) {
        const { linkValue } = this.props;

        if (event.key === ENTER_KEY) {
            // Enter key may cause unexpected form submission
            event.preventDefault();

            this.accept(linkValue);
        }
    }

    onKeyDown(event) {
        const { keyCode } = event;
        const { selectedSuggestionIndex, suggestions } = this.state;

        if (keyCode === 40 && selectedSuggestionIndex < suggestions.length - 1) {
            event.preventDefault();
            this.setState({ selectedSuggestionIndex: selectedSuggestionIndex + 1 });
        } else if (keyCode === 38 && selectedSuggestionIndex > -1) {
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

        if (value.length < 3) {
            return;
        }

        callArticleTitles(siteId, value)
            .then(({ suggestions }) => this.setState({ suggestions }))
            .catch(err => {
                console.log('#######', 'err', err);
            });
    }

    accept(url) {
        const { onAccept } = this.props;

        if (this.isValidUrl(url)) {
            onAccept(url);
        } else {
            this.setState({ isLinkInvalid: true });
        }
    }

    isValidUrl(url) {
        return URL_REGEX.test(url);
    }

    render() {
        const { onRemove, isEdit, linkValue } = this.props;
        const { isLinkInvalid, selectedSuggestionIndex, suggestions } = this.state;
        const { i18n } = this.context;

        return (
            <div className={cls('pe-input-tooltip wds-dropdown wds-is-active wds-no-chevron', suggestions.length && 'has-suggestions')}>
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
                    {isLinkInvalid && <span className="wds-input__hint">{i18n['hyperlinking-error']}</span>}
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
