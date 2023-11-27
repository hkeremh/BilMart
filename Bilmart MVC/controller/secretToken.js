import  jwt from "jsonwebtoken";

let exports = {};
exports.createSecretUserToken = (id) => {
    return jwt.sign({ id }, process.env.USER_TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};
exports.createSecretTempUserToken = (id) => {
return jwt.sign({ id }, process.env.TEMP_USER_TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};



export default exports;