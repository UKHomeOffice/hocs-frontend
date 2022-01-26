module.exports = async (actions) => {

    const { recordInterest: interests } = actions.caseActionData;

    return interests.map( interestEntry => {
        return {
            title: interestEntry.caseTypeActionLabel,
            interestedPartyTitle: interestEntry.interestedPartyEntity.title,
            detailsOfInterest: interestEntry.detailsOfInterest,
        };
    });
};
