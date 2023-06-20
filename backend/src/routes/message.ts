import type { FastifyInstance } from 'fastify';

import { z } from 'zod';
import { sign, verify } from '../util/jwt';
import { type } from 'os';
type LoginBody = {
    email?: string;

    username: string;
    password: string;
};

export default function message(router: FastifyInstance, done: Function, db) {
    router.get('/:username', async (req, res) => {
        const { username } = req.params as Record<string, any>;
        const token = req.headers.authorization as string;

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        const verified = await verify(token);

        if (!verified) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        if (!username) {
            return {
                succes: true,
                messages: db.get(`messages.${verified.payload.username}`) || {},
            };
        } else {
            let userDB = db.get(`users.${username}`);
            let userDB2 = db.get(`users.${verified.payload.username}`);

            if (!userDB || !userDB2) {
                return res.status(400).send({ error: 'User not found' });
            }

            userDB2 = db.get(`messages.${verified.payload.username}.${username}`);

            if (!userDB2) {
                return res.status(400).send({ error: 'Message(s) not found' });
            }

            return res.status(200).send({ succes: true, messages: userDB2 });
        }
    });

    router.post('/:username', async (req, res) => {
        let { username } = req.params as Record<string, any>;
        let { message } = req.body as any;
        const token = req.headers.authorization as string;
        if (!token || !username || !message) {
            return res.status(401).send({ error: 'Invalid Body' });
        }

        const verified = await verify(token);

        if (!verified) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        let userDB = db.get(`users.${username}`);
        let userDB2 = db.get(`users.${verified.payload.username}`);

        if (!userDB || !userDB2) {
            return res.status(400).send({ error: 'User not found' });
        }

        userDB = db.get(`messages.${username}.${verified.payload.username}`);
        userDB2 = db.get(`messages.${verified.payload.username}.${username}`);

        if (!userDB2 || !userDB) {
            db.set(`messages.${verified.payload.username}.${username}`, []);
            db.set(`messages.${username}.${verified.payload.username}`, []);

            userDB = db.get(`messages.${username}.${verified.payload.username}`);
            userDB2 = db.get(`messages.${verified.payload.username}.${username}`);
        }

        userDB.push({
            author: verified.payload.username,
            message: message,
            createdAt: Date.now(),
            profilePicture: db.get(`users.${verified.payload.username}.profilePicture`),
        });

        userDB2.push({
            author: verified.payload.username,
            message: message,
            createdAt: Date.now(),
            profilePicture: db.get(`users.${verified.payload.username}.profilePicture`),
        });

        db.set(`messages.${username}.${verified.payload.username}`, userDB);
        db.set(`messages.${verified.payload.username}.${username}`, userDB2);

        return res.status(200).send({ succes: true });
    });

    router.post('/create', async (req, res) => {
        const { username } = req.body as any;
        const token = req.headers.authorization as string;

        if (!token) {
            return res.status(401).send({ error: 'Invalid Token' });
        }

        
        if (!username) {
            return res.status(401).send({ error: 'Invalid Body' });
        }

        const verified = await verify(token);

        if (!verified) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({ error: 'User not found' });
        }

        userDB = db.get(`messages.${username}.${verified.payload.username}`);

        if (!userDB) {
            db.set(`messages.${verified.payload.username}.${username}`, []);
            db.set(`messages.${username}.${verified.payload.username}`, []);

            userDB = db.get(`messages.${username}.${verified.payload.username}`);
        }

        return res.status(200).send({ succes: true, username: username });
    });

    done();
}
