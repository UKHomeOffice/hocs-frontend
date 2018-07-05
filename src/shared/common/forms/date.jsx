import React, {Component, Fragment} from "react";

class Date extends Component {

    constructor(props) {
        super(props);
        const dateComponents = this.parseValue();
        this.state = {...dateComponents};
    }

    datePart(field) {
        return `${this.props.name}-${field}`;
    }

    componentDidMount() {
        this.props.updateState(this.state);
    }

    handleChange(field, value) {
        this.setState({[field]: value});
        this.props.updateState({[field]: value});
    }

    parseValue() {
        const parts = this.props.value && this.props.value.split('-');
            return {
                [this.datePart('day')]: parts && parts[2] || '',
                [this.datePart('month')]: parts && parts[1] || '',
                [this.datePart('year')]: parts && parts[0] || ''
            };
    }

    render() {
        const {
            label,
            hint,
            error,
            disabled
        } = this.props;
        return (
            <div className={`form-group${error ? ' form-group-error' : ''}`}>
                <fieldset disabled={disabled}>
                    <legend>
                        <span className="form-label-bold">{label}</span>
                        {hint && <span className="form-hint">{hint}</span>}
                        {error && <span className="error-message">{error}</span>}
                    </legend>
                    <div className="form-date">
                        <div className="form-group form-group-day">
                            <label className="form-label" htmlFor={this.datePart('day')}>Day</label>
                            <input
                                className={`form-control ${error ? 'form-control-error' : ''}`}
                                id={this.datePart('day')}
                                name={this.datePart('day')}
                                type="number"
                                pattern="[0-9]*"
                                min="1"
                                max="31"
                                value={this.state[this.datePart('day')]}
                                onChange={e => this.handleChange(this.datePart('day'), e.target.value)}
                            />
                        </div>
                        <div className="form-group form-group-month">
                            <label className="form-label" htmlFor={this.datePart('month')}>Month</label>
                            <input
                                className={`form-control ${error ? 'form-control-error' : ''}`}
                                id={this.datePart('month')}
                                name={this.datePart('month')}
                                type="number"
                                pattern="[0-9]*"
                                min="1"
                                max="12"
                                value={this.state[this.datePart('month')]}
                                onChange={e => this.handleChange(this.datePart('month'), e.target.value)}
                            />
                        </div>
                        <div className="form-group form-group-year">
                            <label className="form-label" htmlFor={this.datePart('year')}>Year</label>
                            <input
                                className={`form-control ${error ? 'form-control-error' : ''}`}
                                id={this.datePart('year')}
                                name={this.datePart('year')}
                                type="number"
                                pattern="[0-9]*"
                                min="1900"
                                max="2100"
                                value={this.state[this.datePart('year')]}
                                onChange={e => this.handleChange(this.datePart('year'), e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        )
    }
}

Date.defaultProps = {
    value: '',
    disabled: false
};

export default Date;