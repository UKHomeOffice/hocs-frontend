import React from 'react';
import { Context } from '../contexts/application.jsx';
import { Helmet } from 'react-helmet-async';

const countDown = 60000;
const defaultTargetDate = new Date().getTime() + countDown;

const SessionTimer = () => {
    const { layout: { header: { service } } } = React.useContext(Context);
    const [targetDate,] = React.useState(new Date(defaultTargetDate));
    const [remainingSeconds, setRemainingSeconds] = React.useState(countDown / 1000);
    let requestRef = React.useRef();

    let localRequestAnimationFrame;
    // eslint-disable-next-line no-undef
    if (typeof requestAnimationFrame === 'undefined' || !requestAnimationFrame) {
        localRequestAnimationFrame = setImmediate;
    } else {
        // eslint-disable-next-line no-undef
        localRequestAnimationFrame = requestAnimationFrame;
    }

    // eslint-disable-next-line no-undef
    // let localCancelAnimationFrame = typeof cancelAnimationFrame === 'undefined' ? clearImmediate : cancelAnimationFrame;

    const countItDown = () => localRequestAnimationFrame(() => {
        const diff = Math.floor((targetDate - new Date().getTime()) / 1000);
        setRemainingSeconds(diff);
        console.log(diff);
        if (diff > 0) {
            countItDown();
        }
    });

    React.useEffect(() => {
        countItDown();
        // requestRef = localRequestAnimationFrame(countItDown);
        // return () => localCancelAnimationFrame(requestRef.current);
    }, [targetDate]);

    countItDown();
    return remainingSeconds < 55 && <Helmet defer={false} titleTemplate={`${remainingSeconds}s remaining %s`}>
        <title>{service.toString()}</title>
    </Helmet>;
};

export default SessionTimer;
