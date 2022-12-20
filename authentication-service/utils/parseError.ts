const parseError = (e: unknown, f: Function) => {
    if (typeof e === 'string') {
        f(e.toUpperCase());
    } else if (e instanceof Error) {
        f(e.message);
    }
};

export default parseError;