module.exports = async (actions) => {

    const { recordInterest: interests } = actions.caseActionData;

    return await Promise.all(interests.map( async interestEntry => {
        return {
            title: interestEntry.caseTypeActionLabel,
            interestedPartyTitle: interestEntry.interestedPartyEntity.title,
            detailsOfInterest: interestEntry.detailsOfInterest,
        };
    }));
};
