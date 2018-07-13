import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class EntityList extends Component {

    constructor(props) {
        super(props);
        const fallbackValue = this.props.choices[0] ? this.props.choices[0].value : null;
        const value = this.props.value || fallbackValue;
        this.state = { value };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    render() {
        const {
            actionUrl,
            choices,
            className,
            disabled,
            error,
            hint,
            label,
            name,
            type
        } = this.props;
        return (
            <fieldset className={className} disabled={disabled}>
                <legend htmlFor={name} id={`${name}-label`}>
                    <span className="form-label-bold">{label}</span>
                    {hint && <span className="form-hint">{hint}</span>}
                    {error && <span className="error-message">{error}</span>}
                </legend>
                <table>
                    <tbody>
                        <tr>
                            <td width='40px'>Primary</td>
                            <td>Name</td>
                        </tr>
                        {choices && choices.map((choice, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className='multiple-choice fix-entity-list-multiple-choice'>
                                            <input id={`${name}-${choice.value}`}
                                                type={type}
                                                name={name}
                                                value={choice.value}
                                                checked={(this.state.value === choice.value)}
                                                onChange={e => this.handleChange(e)}
                                            />
                                            <label htmlFor={`${name}-${choice.value}`}></label>
                                        </div>
                                    </td>
                                    <td>
                                        <label htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
                                    </td>
                                    <td>
                                        <Link></Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {choices.length === 0 && <Fragment>No EntityList</Fragment>}
                    </tbody>
                </table>
                <br />
                <Link to={actionUrl} className="button-secondary-action">Add a {label}</Link>
            </fieldset>
        );
    }
}

EntityList.propTypes = {
    actionUrl: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

EntityList.defaultProps = {
    choices: [],
    disabled: false,
    type: 'radio'
};

export default EntityList;