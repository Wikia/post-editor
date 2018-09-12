import { h, Component } from 'preact';

import WdsIconsTrashSmall from 'design-system/dist/svg/wds-icons-trash-small.svg';
import WdsIconsCheckmarkSmall from 'design-system/dist/svg/wds-icons-checkmark-small.svg';

import cls from '../utils/cls';

import tooltip from './Tooltip';

import './InputTooltip.scss';

const ENTER_KEY = 'Enter';
const URL_REGEX = /^(http:\/\/|https:\/\/|www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

class InputTooltip extends Component {
    static getDerivedStateFromProps({ linkValue }, { inputValue }) {
        return {
            inputValue: inputValue || linkValue,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            isLinkInvalid: false,
        };

        this.input = null;
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onInput = this.onInput.bind(this);
    }

    componentDidMount() {
        const { isEdit } = this.props;

        if (!isEdit) {
            this.input.focus();
        }
    }

    onKeyPress(event) {
        const { inputValue } = this.state;

        if (event.key === ENTER_KEY) {
            // Enter key may cause unexpected form submission
            event.preventDefault();

            this.accept(inputValue);
        }
    }

    onInput({ target: { value } }) {
        this.setState({
            inputValue: value,
        });
    }

    accept(url) {
        const { onAccept } = this.props;

        if (URL_REGEX.test(url)) {
            let urlToFormat = url;

            if (!url.match(/^https?:\/\//)) {
                urlToFormat = `http://${url}`;
            }

            onAccept(urlToFormat);
        } else {
            this.setState({ isLinkInvalid: true });
        }
    }

    render() {
        const {
            onRemove,
            isEdit,
        } = this.props;
        const { isLinkInvalid, inputValue } = this.state;
        const { i18n } = this.context;

        return (
            <div className="pe-input-tooltip">
                <div className={cls('wds-input', isLinkInvalid && 'has-error')}>
                    <div className="wds-input__field-wrapper">
                        <input
                            placeholder={i18n['hyperlinking-placeholder']}
                            className="wds-input__field"
                            ref={(el) => { this.input = el; }}
                            value={inputValue}
                            onInput={this.onInput}
                            onKeyPress={this.onKeyPress}
                        />
                        {isEdit && <WdsIconsTrashSmall onClick={onRemove} className="wds-icon wds-icon-small pe-input-tooltip__remove" />}
                        <WdsIconsCheckmarkSmall
                            onClick={() => this.accept(inputValue)}
                            className="wds-icon wds-icon-small pe-input-tooltip__accept"
                        />
                    </div>
                    {isLinkInvalid && <span className="wds-input__hint">{i18n['hyperlinking-error']}</span>}
                </div>
            </div>
        );
    }
}

export default tooltip(InputTooltip);
