module.exports = (actionLabel, { logger })=> {
    logger.debug('Retrieved Case Action Label: {}', actionLabel);
    return actionLabel;
};
