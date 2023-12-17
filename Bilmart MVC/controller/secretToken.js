import  jwt from "jsonwebtoken";

let exports = {};
/**
 * Creates a secret user token using the user's ID.
 *
 * @param {string} id - The user's ID.
 * @returns {string} - The generated secret user token.
 */
exports.createSecretUserToken = (id) => {
    return jwt.sign({ id }, process.env.USER_TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};

/**
 * Creates a secret temporary user token using the user's ID.
 *
 * @param {string} id - The user's ID.
 * @returns {string} - The generated secret temporary user token.
 */
exports.createSecretTempUserToken = (id) => {
return jwt.sign({ id }, process.env.TEMP_USER_TOKEN_KEY, {
        expiresIn: 10 * 60,
    });
};



export default exports;