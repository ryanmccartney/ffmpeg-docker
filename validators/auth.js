"use strict";

module.exports = {
    username: {
        exists: {
            errorMessage: "Username is required.",
        },
        isString: { errorMessage: "Username must be a string" },
    },
    password: {
        exists: {
            errorMessage: "Password is required.",
        },
        isString: { errorMessage: "Password must be a string" },
    },
};
