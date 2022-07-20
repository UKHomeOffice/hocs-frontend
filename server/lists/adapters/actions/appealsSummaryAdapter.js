const { formatDate } = require('../../../libs/dateHelpers');

const outcomeMap = {
    DecisionUpheld: 'Decision upheld',
    DecisionPartUpheld: 'Decision upheld in part',
    ComplaintUpheld: 'Complaint upheld'
};

module.exports = async (actions, fetchList) => {

    const { appeals } = actions.caseActionData;
    const { caseTypeActionData } = actions;

    return await Promise.all(appeals.map( async appealEntry => {

        const caseActionType = caseTypeActionData.find(type => type.uuid === appealEntry.caseTypeActionUuid);
        const props = JSON.parse(caseActionType.props);
        if (props.appealOfficerData) {
            var officerChoices = await fetchList(props.appealOfficerData.officer.choices);
            var directorateChoices = await fetchList(props.appealOfficerData.directorate.choices);
            var officer = officerChoices.find(choice =>
                choice.value === JSON.parse(
                    appealEntry.appealOfficerData)[props.appealOfficerData.officer.value]
            ).label;
            var directorate = directorateChoices.find(choice =>
                choice.value === JSON.parse(
                    appealEntry.appealOfficerData)[props.appealOfficerData.directorate.value]
            ).label;
        }

        return {
            title: appealEntry.caseTypeActionLabel,
            outcome: outcomeMap[appealEntry.outcome] || null,
            officerDirectorate: directorate || null,
            officer: officer || null,
            status: appealEntry.status !== 'Pending' ? 'Yes' : 'No',
            complexCase: appealEntry.complexCase || null,
            note: appealEntry.note || null,
            dateSentRMS: formatDate(appealEntry.dateSentRMS) || null
        };
    })).catch((error) => {});
};
