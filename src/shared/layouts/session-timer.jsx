import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';
import { Context } from '../contexts/application.jsx';

const getDefaultExpiryDate = defaultTimeoutSeconds => new Date(new Date().getTime() + defaultTimeoutSeconds * 1000);
const getRemainingSeconds = targetDate => Math.floor((targetDate - new Date().getTime()) / 1000);
const keepAlive = () => axios.get('/api/keepalive')
    // eslint-disable-next-line no-console
    .then(() => console.log('keepalive completed'))
    // eslint-disable-next-line no-undef
    .catch(() => window.location.reload());

const isTimingOut = (countDownForSeconds, remainingSeconds) => remainingSeconds < countDownForSeconds && remainingSeconds > 0;
const isTimedOut = remainingSeconds => remainingSeconds <= 0;
const getModalTitle = (countDownForSeconds, remainingSeconds) => isTimingOut(countDownForSeconds, remainingSeconds) ? `Your session will expire in ${remainingSeconds} seconds` : 'Your session has expired';
const getModalMessage = (countDownForSeconds, remainingSeconds) => isTimingOut(countDownForSeconds, remainingSeconds) ? 'We won\'t be able to save what you have done and you\'ll lose your progress. \n Click Continue to extend your session.' : 'You\'ll need to login again.';
const getButtonText = (countDownForSeconds, remainingSeconds) => isTimingOut(countDownForSeconds, remainingSeconds) ? 'Continue' : 'Return to login';

const SessionTimer = () => {
    const { layout: { countDownForSeconds, defaultTimeoutSeconds, header: { service } } } = React.useContext(Context);
    // date stored as seconds since epoch to minimise conversions
    const [targetDate, setTargetDate] = React.useState(getDefaultExpiryDate(defaultTimeoutSeconds));
    const [remainingSeconds, setRemainingSeconds] = React.useState(defaultTimeoutSeconds);

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
        if (isTimingOut(countDownForSeconds, remainingSeconds)) {
            keepAlive();
        } else {
            // eslint-disable-next-line no-undef
            window.location.reload();
        }
    }, [remainingSeconds]);

    return <>
        {typeof window !== 'undefined' && <Helmet defer={false} titleTemplate={`${isTimingOut(countDownForSeconds, remainingSeconds) ? `${remainingSeconds}s remaining ` : ''}%s`}>
            {service && <title>{service.toString()}</title>}
        </Helmet>}
        <Modal
            isOpen={isTimingOut(countDownForSeconds, remainingSeconds) || isTimedOut(remainingSeconds)}
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
            <h2 className="govuk-heading-l">{getModalTitle(countDownForSeconds, remainingSeconds)}</h2>
            {getModalMessage(countDownForSeconds, remainingSeconds).split('\n').map((p, i) =>
                <p className="govuk-body" key={i}>{p}</p>
            )}
            <button className="govuk-button" onClick={onModalButtonClick}>
                {getButtonText(countDownForSeconds, remainingSeconds)}
            </button>
        </Modal>
    </>;
};

export default SessionTimer;
