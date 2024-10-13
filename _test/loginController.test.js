import { login } from '../src/controller/controller.js';  // Path ke controller
import prisma from '../src/libs/prisma.js';  // Prisma instance
import jwt from 'jsonwebtoken';  // Mock JWT sign function
import { mockResponse, mockRequest, mockNext } from './testUtils.js';  // Utility untuk mock express
import { response } from '../src/res/response.js';  // Custom response utility

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../src/libs/prisma.js', () => ({
    User: {
        findFirst: jest.fn(),
    },
}));
jest.mock('../src/res/response.js');

describe('POST /login', () => {
    let req, res, next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
        jest.clearAllMocks();  // Bersihkan semua mock sebelum setiap test
    });

    it('should return 401 if username is not found', async () => {
        // Mock prisma.User.findFirst untuk mengembalikan null
        prisma.User.findFirst.mockResolvedValue(null);
        
        req.body = { username: 'nonexistentuser', password: 'wrongpassword' };

        await login(req, res, next);

        expect(prisma.User.findFirst).toHaveBeenCalledWith({
            where: { username: 'nonexistentuser' },
            cacheStrategy: { ttl: 60 }
        });
        expect(response).toHaveBeenCalledWith(401, { Authenticated: false }, "Username dan password tidak ditemukan", res);
    });

    it('should return 401 if password is incorrect', async () => {
        // Mock prisma.User.findFirst untuk mengembalikan user yang ada
        prisma.User.findFirst.mockResolvedValue({ id: 1, username: 'testuser', password: 'correctpassword' });

        req.body = { username: 'testuser', password: 'wrongpassword' };

        await login(req, res, next);

        expect(prisma.User.findFirst).toHaveBeenCalledWith({
            where: { username: 'testuser' },
            cacheStrategy: { ttl: 60 }
        });
        expect(response).toHaveBeenCalledWith(401, { Authenticated: false }, "Password salah", res);
    });

    it('should return 200 and set JWT cookie if login is successful', async () => {
        // Mock prisma.User.findFirst untuk mengembalikan user yang valid
        prisma.User.findFirst.mockResolvedValue({ id: 1, username: 'testuser', password: 'correctpassword' });

        // Mock jwt.sign untuk mengembalikan token
        jwt.sign.mockReturnValue('mockedtoken');

        req.body = { username: 'testuser', password: 'correctpassword' };

        await login(req, res, next);

        expect(prisma.User.findFirst).toHaveBeenCalledWith({
            where: { username: 'testuser' },
            cacheStrategy: { ttl: 60 }
        });
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 1 },
            process.env.JWT_SECRET,
            { algorithm: 'HS512', expiresIn: '1h' }
        );
        expect(res.cookie).toHaveBeenCalledWith('token', 'mockedtoken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000
        });
        expect(response).toHaveBeenCalledWith(200, { Authenticated: true }, "Successful", res);
    });

    it('should return 500 if JWT generation fails', async () => {
        // Mock prisma.User.findFirst untuk mengembalikan user yang valid
        prisma.User.findFirst.mockResolvedValue({ id: 1, username: 'testuser', password: 'correctpassword' });

        // Mock jwt.sign untuk melempar error
        jwt.sign.mockImplementation(() => { throw new Error('JWT generation failed'); });

        req.body = { username: 'testuser', password: 'correctpassword' };

        await login(req, res, next);

        expect(prisma.User.findFirst).toHaveBeenCalledWith({
            where: { username: 'testuser' },
            cacheStrategy: { ttl: 60 }
        });
        expect(response).toHaveBeenCalledWith(500, null, "Fail", res);
    });
});
