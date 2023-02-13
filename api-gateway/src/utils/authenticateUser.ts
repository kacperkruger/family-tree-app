import {getUserDetails, getUserSensitiveData} from '@kacperkruger/clients/user';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import verifyPassword from './verifyPassword';

const authenticateUser = async (username: string, password: string, done: Function) => {
    try {
        const userSensitiveData = await getUserSensitiveData(username);
        if (!userSensitiveData) return done(null, false, {message: 'Incorrect username or password.'});
        const isCorrectPass = await verifyPassword(password, userSensitiveData.password);
        if (!isCorrectPass) return done(null, false, {message: 'Incorrect username or password.'});
        const user = await getUserDetails(userSensitiveData._id);
        return done(null, user);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return done(errorMessage, null);
    }
};

export default authenticateUser;