import {IdbConnData} from './IdbConnData';

const dbConnData: IdbConnData = {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || '',
    password: process.env.NEO4J_PASSWORD || ''
};

export default dbConnData;
