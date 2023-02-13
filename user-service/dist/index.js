"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectToMongo_1 = __importDefault(require("./utils/connectToMongo"));
const express_1 = __importDefault(require("express"));
const expressConfig_1 = __importDefault(require("./configs/expressConfig"));
const apiConfig_1 = __importDefault(require("./configs/apiConfig"));
const common_server_utils_1 = require("@kacperkruger/common-server-utils/");
const dotenvConfig_1 = __importDefault(require("./configs/dotenvConfig"));
const app = (0, express_1.default)();
(0, dotenvConfig_1.default)();
(0, expressConfig_1.default)(app);
(0, apiConfig_1.default)(app);
(0, connectToMongo_1.default)().then(_ => {
    (0, common_server_utils_1.startServer)(app);
}).catch(e => {
    console.log(e);
    const errorMessage = (0, common_server_utils_1.parseErrorMessage)(e);
    console.log(errorMessage);
});
