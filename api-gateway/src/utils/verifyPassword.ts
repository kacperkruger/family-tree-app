import bcrypt from 'bcrypt';

const verifyPassword = (candidate: string, actual: string): Promise<boolean> => {
    return bcrypt.compare(candidate, actual);
};

export default verifyPassword;