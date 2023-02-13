"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchMongoDbConnData = () => {
    const mongoHost = process.env.MONGO_HOST;
    const mongoPort = process.env.MONGO_PORT;
    const mongoDatabase = process.env.MONGO_DATABASE;
    return {
        uri: `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`,
        user: process.env.MONGO_USER || '',
        password: process.env.MONGO_PASS || ''
    };
};
exports.default = fetchMongoDbConnData;
