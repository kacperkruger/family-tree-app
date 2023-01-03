import {IdbConnData} from './IdbConnData';

const fetchNeo4jConnData = (): IdbConnData => {
    return {
        uri: process.env.NEO4J_URI || '',
        user: process.env.NEO4J_USER || '',
        password: process.env.NEO4J_PASSWORD || ''
    };
};


export default fetchNeo4jConnData;
