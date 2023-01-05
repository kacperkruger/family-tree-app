import bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
    if (!password) {
        throw new Error('Password was not provided');
    }
    const salt = await bcrypt.genSalt(Math.random() * (15 - 10) + 10);
    return await bcrypt.hash(password, salt);
};

export default hashPassword;