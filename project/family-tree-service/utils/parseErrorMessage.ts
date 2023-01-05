const parseErrorMessage = (e: unknown): string => {
    if (typeof e === 'string') {
        return e.toUpperCase();
    } else if (e instanceof Error) {
        return e.message;
    }
    return 'Internal server error';
};

export default parseErrorMessage;