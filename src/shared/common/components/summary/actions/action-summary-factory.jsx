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
        case 'Appeals':
            return renderComponent(AppealSummary, actions.find(actions => actions.title === actionType));
        case 'Recordinterest':
            return renderComponent(InterestSummary, actions.find(actions => actions.title === actionType));
        default:
            return false;
    }
};

export default getActionSummary;