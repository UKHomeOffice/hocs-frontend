import React from 'react';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';
import { Context } from '../contexts/application.jsx';

const countDown = 60000;
const getTargetDate = () => new Date(new Date().getTime() + countDown);
const getModalTitle = remainingSeconds => remainingSeconds > 0 ? `Your session will expire in ${remainingSeconds} seconds` : 'Your session has expired';
const getModalMessage = remainingSeconds => remainingSeconds > 0 ? 'We won\'t be able to save what you have done and you\'ll lose your progress. \n Click Continue to extend your session.' : 'You\'ll need to login again.';
const getButtonText = remainingSeconds => remainingSeconds > 0 ? 'Continue' : 'Return to login';

const SessionTimer = () => {
    const { layout: { header: { service } } } = React.useContext(Context);
    const [targetDate,] = React.useState(getTargetDate());
    const [remainingSeconds, setRemainingSeconds] = React.useState(countDown / 1000);

    React.useEffect(() => {
        Modal.setAppElement('#app');
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor((targetDate - new Date().getTime()) / 1000);
            setRemainingSeconds(diff);
            if (diff <= 0) {
                clearInterval(interval);
            }
        }, 500);
        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    return <>
        {typeof window !== 'undefined' && <Helmet defer={false} titleTemplate={`${remainingSeconds > 55 || remainingSeconds <= 0 ? '' : `${remainingSeconds}s remaining `}%s`}>
            {service && <title>{service.toString()}</title>}
        </Helmet>}
        <Modal
            isOpen={remainingSeconds <= 55}
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
            <button className="govuk-button">
                {getButtonText(remainingSeconds)}
            </button>
        </Modal>
    </>;
};

export default SessionTimer;
