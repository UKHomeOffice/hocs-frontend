import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';
import { Context } from '../contexts/application.jsx';

const defaultExpiryMilliseconds = 60000;
const warningCountdownStart = 55;
const getDefaultExpiryDate = () => new Date(new Date().getTime() + defaultExpiryMilliseconds);
const getRemainingSeconds = targetDate => Math.floor((targetDate - new Date().getTime()) / 1000);
const keepAlive = () => axios.get('/api/keepalive')
    // eslint-disable-next-line no-console
    .then(() => console.log('keepalive completed'))
    // eslint-disable-next-line no-undef
    .catch(() => window.location.reload());

const isTimingOut = remainingSeconds => remainingSeconds < warningCountdownStart && remainingSeconds > 0;
const isTimedOut = remainingSeconds => remainingSeconds <= 0;
const getModalTitle = remainingSeconds => isTimingOut(remainingSeconds) ? `Your session will expire in ${remainingSeconds} seconds` : 'Your session has expired';
const getModalMessage = remainingSeconds => isTimingOut(remainingSeconds) ? 'We won\'t be able to save what you have done and you\'ll lose your progress. \n Click Continue to extend your session.' : 'You\'ll need to login again.';
const getButtonText = remainingSeconds => isTimingOut(remainingSeconds) ? 'Continue' : 'Return to login';

const SessionTimer = () => {
    const { layout: { header: { service } } } = React.useContext(Context);
    const [targetDate, setTargetDate] = React.useState(getDefaultExpiryDate());
    const [remainingSeconds, setRemainingSeconds] = React.useState(defaultExpiryMilliseconds / 1000);

    React.useEffect(() => {
        Modal.setAppElement('#app');

        axios.interceptors.response.use(function (response) {
            const sessionTimeoutHeader = response.headers['x-auth-session-expiresat'];
            if (sessionTimeoutHeader && !isNaN(new Date(sessionTimeoutHeader).getTime())) {
                const expiresAt = new Date(sessionTimeoutHeader);
                setTargetDate(expiresAt.getTime());
            }
            return response;
        }, (error) => Promise.reject(error));

        // make sure we start with an up-to date expiry value;
        keepAlive();
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const diff = getRemainingSeconds(targetDate);
            setRemainingSeconds(diff);
            if (diff <= 0) {
                clearInterval(interval);
            }
        }, 500);
        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    const onModalButtonClick = React.useCallback(() => {
        if (isTimingOut(remainingSeconds)) {
            keepAlive();
        } else {
            // eslint-disable-next-line no-undef
            window.location.reload();
        }
    }, [remainingSeconds]);

    return <>
        {typeof window !== 'undefined' && <Helmet defer={false} titleTemplate={`${isTimingOut(remainingSeconds) ? `${remainingSeconds}s remaining ` : ''}%s`}>
            {service && <title>{service.toString()}</title>}
        </Helmet>}
        <Modal
            isOpen={isTimingOut(remainingSeconds) || isTimedOut(remainingSeconds)}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            style={{
                overlay: {
                    backgroundColor: '#bdbdbdbd',
                    display: 'flex'
                },
                content: {
                    border: 'none',
                    borderRadius: '0px',
                    margin: 'auto',
                    position: 'relative'
                }
            }} >
            <h2 className="govuk-heading-l">{getModalTitle(remainingSeconds)}</h2>
            {getModalMessage(remainingSeconds).split('\n').map((p, i) =>
                <p className="govuk-body" key={i}>{p}</p>
            )}
            <button className="govuk-button" onClick={onModalButtonClick}>
                {getButtonText(remainingSeconds)}
            </button>
        </Modal>
    </>;
};

export default SessionTimer;
