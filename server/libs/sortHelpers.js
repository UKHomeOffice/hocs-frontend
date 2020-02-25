const sortObjectByProp = selector => (a, b) => {
    var x = selector(a).toLowerCase();
    var y = selector(b).toLowerCase();
    if (x < y) { return -1; }
    if (x > y) { return 1; }
    return 0;
};

module.exports = {
    sortObjectByProp
};
