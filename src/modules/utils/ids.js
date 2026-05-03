const generateUserId = () => {
    return Math.floor(Math.random() * 90000) + 10000;   // Genera entre 10000 y 99999
};

const generateProductId = () => {
    return Math.floor(Math.random() * 90000) + 10000;
};

const generateCartId = () => {
    return Math.floor(Math.random() * 90000) + 10000;
};

module.exports = {
    generateUserId,
    generateProductId,
    generateCartId
};