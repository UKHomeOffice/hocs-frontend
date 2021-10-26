import React from 'react';
import Appeals from './appeals.jsx';
import Extensions from './extensions.jsx';


const renderComponent = (Component, data) => {

    return (
        <Component props={data} />
    );
};


export function actionComponentFactory(actionType, options) {

    switch (actionType){
        case 'APPEAL':
            return (
                <>
                    { renderComponent(Appeals, options) }
                    <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"/>
                </>
            );
        case 'EXTENSION':
            return (
                <>
                    { renderComponent(Extensions, options) }
                    <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"/>
                </>);
        default:
            return null;
    }
}