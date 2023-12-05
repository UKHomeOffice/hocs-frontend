import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorSummary extends Component {

    constructor(props){
        super(props);
        this.ref = React.createRef();
    }

    scrollInToView(e, key, link) {
        e.preventDefault();
        /* eslint-disable-next-line no-undef */
        const elementLink = document.getElementById(link);
        if (elementLink) {
            elementLink.scrollIntoView();
        }

        /* eslint-disable-next-line no-undef */
        const elementKey = document.getElementById(key);
        try {
            const elementFocus = elementKey.getElementsByClassName('errorFocus');
            elementFocus[0].focus();
        }
        catch {
            elementKey.focus();
        }
    }

    componentDidMount(){
        this.ref.current && this.ref.current.scrollIntoView && this.ref.current.scrollIntoView();
    }

    render() {
        const {
            description,
            errors,
            heading
        } = this.props;
        return (
            <div className="govuk-error-summary" role="alert" aria-labelledby="error-summary-heading-example-1" tabIndex="-1" ref={this.ref}>

                <h2 className="govuk-error-summary__title" id="error-summary-heading-example-1">
                    {heading}
                </h2>
                <div className="govuk-error-summary__body">
                    {description && <p>
                        {description}
                    </p>}

                    <ul className="govuk-list govuk-error-summary__list">
                        {Object.entries(errors).map(([key, value]) => {
                            const link = `${key}-error`;
                            return (
                                <li key={key}>
                                    <a href={`#${link}`} onClick={(e) => this.scrollInToView(e, key, link)} >{value}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

ErrorSummary.propTypes = {
    description: PropTypes.string,
    errors: PropTypes.object,
    heading: PropTypes.string
};

ErrorSummary.defaultProps = {
    heading: 'There’s a problem',
    description: null,
    errors: {}
};

export default ErrorSummary;
