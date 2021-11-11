
module.exports = (actions, { logger })=> {
    logger.debug('Retrieved Case Actions');

    actions.caseTypeActionData = actions.caseTypeActionData.map(actionType => {
        return {
            ...actionType,
            props: actionType.props ? JSON.parse(actionType.props) : {}
        };
    });
    return actions;
};