export default ({ timeStamp: timeStampA }, { timeStamp: timeStampB }) => {
    if (timeStampA > timeStampB) {
        return -1;
    } else if (timeStampA < timeStampB) {
        return 1;
    } else {
        return 0;
    }
};
