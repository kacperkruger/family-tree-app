"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../routes/user"));
const apiConfig = (app) => {
    app.use('/api/v1/user', user_1.default);
};
exports.default = apiConfig;
