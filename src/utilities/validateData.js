"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumber = exports.validateCharacter = void 0;
const validateCharacter = (idInputUser) => {
    if (idInputUser.includes('*') || idInputUser.includes(',') || idInputUser.includes('-') || idInputUser.includes(':')) {
        return true;
    }
    else {
        return false;
    }
};
exports.validateCharacter = validateCharacter;
const validateNumber = (idInputUser) => {
    if (typeof idInputUser == "number") {
        return true;
    }
    else {
        return false;
    }
};
exports.validateNumber = validateNumber;
