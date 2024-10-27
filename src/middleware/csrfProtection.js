import { doubleCsrf } from "csrf-csrf";

const csrfOptions = {
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "__Host-psifi.x-csrf-token",
    cookieOptions: {
        httpOnly: true, 
        sameSite: "lax", 
        secure: true,
        path: "/"      
    },
    size: 64, //  hash token CSRF
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], 
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
    maxAge: 15 * 60
}

export const { 
    invalidCsrfTokenError, 
    generateToken, 
    doubleCsrfProtection, 
} = doubleCsrf(csrfOptions);
