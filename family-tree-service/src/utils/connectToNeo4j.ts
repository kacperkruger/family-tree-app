import neo4j, {Driver} from 'neo4j-driver';

const connectToNeo4j = async (): Promise<Driver> => {
    const uri = process.env.NEO4J_URI || '';
    const user = process.env.NEO4J_USER || '';
    const password = process.env.NEO4J_PASSWORD || '';
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j');
    return driver;
};

export default connectToNeo4j;