import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Context } from '../contexts/application.jsx';

const countDown = 60000;
const getTargetDate = () => new Date(new Date().getTime() + countDown);

const SessionTimer = () => {
    const { layout: { header: { service } } } = React.useContext(Context);
    const [targetDate, setTargetDate] = React.useState(getTargetDate());
    const [remainingSeconds, setRemainingSeconds] = React.useState(countDown / 1000);
    const [showAsterisk, setShowAsterisk] = React.useState(true);

    React.useEffect(() => {
        // Add a request interceptor
        axios.interceptors.response.use((response) => {
            setTargetDate(getTargetDate());
            console.log(response);
            return response;
        }, (error) => {
            console.log(error);
            return error;
        });
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor((targetDate - new Date().getTime()) / 1000);
            setRemainingSeconds(diff);
            setShowAsterisk(showAsterisk => setShowAsterisk(!showAsterisk));
        }, 500);
        return () => clearInterval(interval);
    }, [targetDate, showAsterisk]);

    return typeof window !== 'undefined' && <Helmet defer={false} titleTemplate={`${remainingSeconds > 55 ? '' : `${showAsterisk ? '*' : remainingSeconds}s remaining `}%s`}>
        {service && <title>{service.toString()}</title>}
    </Helmet>;
};

export default SessionTimer;
