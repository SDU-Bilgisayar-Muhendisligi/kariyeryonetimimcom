import { SignJWT, jwtVerify } from 'jose';

export const sign = async (payload: any) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

export const verify = async (jwt: string) => {
    try {
        return await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
    } catch {
        return false;
    }
};
