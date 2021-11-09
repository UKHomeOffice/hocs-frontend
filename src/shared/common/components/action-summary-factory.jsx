import React from 'react';
import AppealSummary from './action-summary-appeals.jsx';

function renderComponent(Component, items) {
    return (
        <>
            <Component props={items} />
        </>
    );
}

const getActionSummary = (actionType, actions) => {

    switch (actionType) {
        case 'Appeals':
            return renderComponent(AppealSummary, actions.find(actions => actions.title === actionType));
        default:
            return false;
    }
};

export default getActionSummary;