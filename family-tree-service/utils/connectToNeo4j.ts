import neo4j from 'neo4j-driver';
import neo4jConnData from '../configs/neo4jConnData';

const connectToNeo4j = async () => {
    const driver = neo4j.driver(neo4jConnData.uri, neo4j.auth.basic(neo4jConnData.user, neo4jConnData.password));
    console.log(await driver.getServerInfo());
};

export default connectToNeo4j;