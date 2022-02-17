import React from 'react';
import AppealSummary from './action-summary-appeals.jsx';
import InterestSummary from './action-summary-interests.jsx';

function renderComponent(Component, action) {
    return (
        <>
            <Component items={action.items} />
        </>
    );
}

const getActionSummary = (actionType, actions) => {
    switch (actionType) {
        case 'appeals':
            return renderComponent(AppealSummary, actions.find(actions => actions.type === actionType));
        case 'recordInterest':
            return renderComponent(InterestSummary, actions.find(actions => actions.type === actionType));
        default:
            return false;
    }
};

export default getActionSummary;