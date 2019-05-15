import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Hidden extends Component {

    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    _onChange(e) {
        this.setState({ value: e.target.value });
    }

    _onBlur(e) {
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    render() {
        const {
            label,
            name,
            type
        } = this.props;
        return (
            <hidden
                id={name}
                type={type}
                name={name}
                value={this.state.value}
                onChange={e => this._onChange(e)}
                onBlur={e => this._onBlur(e)}
            />
        );
    }
}

Hidden.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

Hidden.defaultProps = {
    label: 'TextArea field',
    type: 'text',
    value: ''
};

export default Hidden;