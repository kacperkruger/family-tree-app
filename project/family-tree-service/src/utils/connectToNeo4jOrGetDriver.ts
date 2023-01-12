import {Driver} from 'neo4j-driver';
import connectToNeo4j from './connectToNeo4j';

const connectToNeo4jOrGetDriver = (() => {
    let driver: Driver;
    let executed = false;

    return async () => {
        if (!executed) {
            executed = true;
            driver = await connectToNeo4j();
        }
        return driver.session();
    };
})();

export default connectToNeo4jOrGetDriver;