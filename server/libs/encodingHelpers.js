const doubleEncodeSlashes = (stringToEncode) => {
    return stringToEncode.split('%2F').join('%252F');
};

module.exports = doubleEncodeSlashes;
