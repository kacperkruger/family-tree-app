"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseErrorMessage = (e) => {
    if (typeof e === 'string') {
        return e.toUpperCase();
    }
    else if (e instanceof Error) {
        return e.message;
    }
    return 'Internal server error';
};
exports.default = parseErrorMessage;
//# sourceMappingURL=parseErrorMessage.js.map