import React from 'react';
import Appeals from './appeals.jsx';
import Extensions from './extensions.jsx';


const renderComponent = (Component, data) => {

    return (
        <Component props={data}/>
    );
};


export function actionComponentFactory(actionType, options) {

    switch (actionType){
        case 'APPEAL':
            return renderComponent(Appeals, options);
        case 'EXTENSION':
            return renderComponent(Extensions, options);
        default:
            return null;
    }
}