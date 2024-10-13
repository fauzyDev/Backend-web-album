// test/testUtils.js
export const mockRequest = () => {
    return {
        body: {},
        cookies: {},
        headers: {},
    };
};

export const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn();
    return res;
};

export const mockNext = () => jest.fn();
