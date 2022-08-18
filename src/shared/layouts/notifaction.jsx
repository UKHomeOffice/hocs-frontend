import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../contexts/application.jsx';
import { clearApiStatus } from '../contexts/actions/index.jsx';

// @TODO: ESLint false positive
// eslint-disable-next-line react/prop-types
const Wrapper = (C) => function NotificationWrapper({ timeoutPeriod = 1000, ...props }) {
    const { dispatch } = useContext(Context);

    useEffect(() => {
        const timeout = setTimeout(() => dispatch(clearApiStatus()), timeoutPeriod);
        return () => clearTimeout(timeout);
    }, []);

    return (<C {...props} />);
};

const Notification = ({ type, display }) => (
    <div className={`notification${type === 'ERROR' ? ' notification--error' : ''}`}>
        {display}
    </div>
);

Notification.propTypes = {
    type: PropTypes.string.isRequired,
    display: PropTypes.string.isRequired,
    timeoutPeriod: PropTypes.number
};

export default Wrapper(Notification);
