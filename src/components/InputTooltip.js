import { h, Component } from 'preact';
import debounce from 'debounce';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import cls from '../utils/cls';
import callArticleTitles from '../utils/api';

import tooltip from './Tooltip';

import './InputTooltip.scss';

const ENTER_KEY = 'Enter';
const DEBOUNCE_INTERVAL = 300;
const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

class InputTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLinkInvalid: false,
            isError: false,
            suggestions: [],
        };

        this.input = null;
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onInput = this.onInput.bind(this);
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

        if (event.key === ENTER_KEY) {
            // Enter key may cause unexpected form submission
            event.preventDefault();

            this.accept(linkValue);
        }
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
        const { isLinkInvalid, suggestions } = this.state;
        const { i18n } = this.context;

        return (
            <div className="pe-input-tooltip">
                <div className={cls('wds-input', isLinkInvalid && 'has-error')}>
                    <div className="wds-input__field-wrapper">
                        <input
                            placeholder={i18n['hyperlinking-placeholder']}
                            className="wds-input__field"
                            ref={(el) => { this.input = el; }}
                            value={linkValue}
                            onInput={this.onInput}
                            onKeyPress={this.onKeyPress}
                        />
                        {isEdit && <WdsIconsTrashSmall onClick={onRemove} className="wds-icon wds-icon-small pe-input-tooltip__remove" />}
                        <WdsIconsCheckmarkSmall
                            onClick={() => this.accept(linkValue)}
                            className="wds-icon wds-icon-small pe-input-tooltip__accept"
                        />
                    </div>
                    {isLinkInvalid && <span className="wds-input__hint">{i18n['hyperlinking-error']}</span>}
                </div>
                {suggestions.map(el => <span>{el.title}</span>)}
            </div>
        );
    }
}

export default tooltip(InputTooltip);
