import { h } from 'preact';

const withSuggestions = (WrappedComponent) => (props) => {
    const { suggestions, ...rest } = props;

    return (
        <div className="dddd">
            <WrappedComponent {...rest} />
            <div className="sugg-wrapper">
                {
                    suggestions.map(el => {
                        return (
                            <div key={el.url}>
                                <a href={el.url}>{el.title}</a>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default withSuggestions;
