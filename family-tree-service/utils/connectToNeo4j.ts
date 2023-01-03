import neo4j, {Driver} from 'neo4j-driver';
import neo4jConnData from '../configs/neo4jConnData';

const connectToNeo4j = (() => {
    let driver: Driver;
    let executed = false;

    return async () => {
        if (!executed) {
            executed = true;
            const dbConnData = neo4jConnData();
            driver = neo4j.driver(dbConnData.uri, neo4j.auth.basic(dbConnData.user, dbConnData.password));
            console.log('Connected to Neo4j');
        }
        return driver.session();
    };
})();

export default connectToNeo4j;