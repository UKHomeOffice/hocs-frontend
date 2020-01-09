import React from 'react';
import { Context } from '../contexts/application.jsx';
import { Helmet } from 'react-helmet-async';

const SessionTimer = () => {
    const { layout: { header: { service } } } = React.useContext(Context);
    const [sessionTimeRemaining, setSessionTimeRemaining] = React.useState(60);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setSessionTimeRemaining(sessionTimeRemaining - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionTimeRemaining]);

    return sessionTimeRemaining < 55 && <Helmet titleTemplate={`${sessionTimeRemaining}s remaining %s`}>
        <title>{service.toString()}</title>
    </Helmet>;
};

export default SessionTimer;
