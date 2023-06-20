import type { FastifyInstance } from 'fastify';

import { z } from 'zod';
import { sign, verify } from '../util/jwt';
import { type } from 'os';
type LoginBody = {
    email?: string;

    username: string;
    password: string;
};

export default function Auth(router: FastifyInstance, done: Function, db) {
    router.post('/login', async (req, res) => {
        let { username, password } = req.body as LoginBody;

        if (!username || !password) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let user = db.get(`users.${username}`);

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (user.auth.password !== password) {
            return res.status(400).send({
                error: 'Invalid password',
            });
        }

        const token = await sign({
            username: user.username,
            email: user.auth.email,
            password: user.auth.password,
        });

        return res.status(200).send({
            success: true,
            token,
        });
    });
    router.post('/register', async (req, res) => {
        let { email, username, password } = req.body as LoginBody;

        if (!username || !password || !email) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let user = db.get(`users`);

        user = Object.values(user).find((user: any) => user.auth.email === email);

        if (user) {
            return res.status(400).send({
                error: 'Email already exists',
            });
        }
        user = db.get(`users.${username}`);
        if (user) {
            return res.status(400).send({
                error: 'Username already exists',
            });
        }

        db.set(`users.${username}`, {
            username,
            auth: {
                email: email,
                password: password,
            },
            biography: '',
            profilePicture: 'def.avif',
            contents: {},
            groups: {},
            followers: [],
            following: [],
        });

        const token = await sign({
            username: username,
            email: email,
            password: password,
        });

        return res.status(200).send({
            success: true,
            token,
        });
    });
    router.post('/verify', async (req, res) => {
        let token = (req.body as Record<string, any>).token;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid token',
            });
        }

        token = await verify(token);
        const user = db.get(`users.${token.payload.username}`);

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (token.payload.password !== user.auth.password) {
            return res.status(400).send({
                error: 'Access denied',
            });
        }

        return res.status(200).send({
            success: true,
            user,
        });
    });
    done();
}
