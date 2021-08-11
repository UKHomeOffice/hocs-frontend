import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ConfirmationWithTeamNameAndCaseRef extends Component {

    extractRequiredTeam(data, CurrentStage, choices) {
        const requiredTeamType = StageTeamTypes[CurrentStage];
        return requiredTeamType ? choices.find(choice => choice.key === data[requiredTeamType]).value : '';
    }

    render() {

        const {
            label,
            caseRef,
            choices,
            data
        } = this.props;

        const teamName = this.extractRequiredTeam(data, data.CurrentStage, choices);

        return (
            <div>
                <div className="govuk-panel govuk-panel--confirmation">
                    <div className="govuk-panel__body">Case {label}: {teamName}
                    </div>
                </div>
                <h2 className="govuk-heading-m">
                    Case {caseRef} {label} {teamName}
                </h2>
            </div>
        );
    }
}

ConfirmationWithTeamNameAndCaseRef.propTypes = {
    label: PropTypes.string,
    caseRef: PropTypes.string,
    choices: PropTypes.array,
    data: PropTypes.object
};

const StageTeamTypes = {
    FOI_ALLOCATION: 'AcceptanceTeam'
};