import type { FastifyInstance } from 'fastify';
import { sign, verify } from '../util/jwt';
import crypto from 'crypto';
import fs from 'fs';
interface verifyBody {
    token: string;
}
import createNotification from '../util/createNotification';
import { JWTVerifyResult } from 'jose';

export default function User(router: FastifyInstance, done: Function, db) {
    //User Bilgilerine erişim
    router.get('/:username', async (req, res) => {
        let username = (req.params as any).username;

        let user = db.get(`users`);

        if (!username) {
            return res.status(400).send({
                succes: true,
                users: user,
            });
        } else {
            user = Object.values(user).find((user: any) => user.username === username);

            if (!user) {
                return res.status(400).send({
                    error: 'User not found',
                });
            }

            //Auth Bilgilerini Gizle
            user = Object.keys(user).reduce((acc, key) => {
                if (key !== 'auth') {
                    acc[key] = user[key];
                }
                return acc;
            }, {});

            return res.status(200).send({
                success: true,
                user: user,
            });
        }
    });

    //Profil Düzenleme
    router.patch('/', async (req, res) => {
        let token = req.headers.authorization;
        let { username, biography, profilePicture, email } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!username || !biography || !profilePicture || !email) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        if (username === db.get(`users.${username}.username`)) {
            return res.status(400).send({
                error: 'Username already exists',
            });
        }

        let userDB = db.get(`users.${user.payload.username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        let data = {
            username: username.value,
            biography: biography.value,
            email: email.value,
        };

        let fileName;

        if (profilePicture.length && profilePicture[0].type === 'file') {
            let file = profilePicture[0];

            if (!fs.existsSync(`./uploads/`)) {
                fs.mkdirSync(`./uploads/`);
            }

            fileName = `${Math.floor(Math.random() * 1000000000000)}.${
                file.mimetype.split('/')[1]
            }`;

            await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());
        }

        db.delete(`users.${user.payload.username}`);

        db.set(`users.${data.username}`, {
            ...userDB,
            username: data.username,
            biography: data.biography,
            profilePicture: profilePicture.length ? fileName : userDB.profilePicture,
            auth: {
                ...userDB.auth,
                email: data.email,
            },
        });

        token = await sign({
            username: data.username,
            email: data.email,
            password: userDB.auth.password,
        });

        return res.status(200).send({
            success: true,
            user: token,
        });
    });
    //İçerik Paylaşma
    router.post('/content', async (req, res) => {
        let token = req.headers.authorization;
        let { description, image } = req.body as any;
        let postID = crypto.randomBytes(16).toString('hex');
        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!description || !image) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let userDB = db.get(`users.${user.payload.username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        let file = image;

        if (!fs.existsSync(`./uploads/`)) {
            fs.mkdirSync(`./uploads/`);
        }

        const fileName = `${Math.floor(Math.random() * 100000000000000)}.${
            file.mimetype.split('/')[1]
        }`;

        await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());

        db.set(`users.${user.payload.username}.contents.${postID}`, {
            description: description.value,
            image: fileName,
        });

        return res.status(200).send({
            success: true,
            content: {
                description: description.value,
                postID: postID,
            },
        });
    });
    //İçerik Silme
    router.delete('/content/:postid', async (req, res) => {
        let token = req.headers.authorization;
        let { postid } = req.params as Record<string, any>;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!postid) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let userDB = db.get(`users.${user.payload.username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!db.get(`users.${user.payload.username}.contents.${postid}`))
            return res.status(400).send({
                error: 'Content not found',
            });

        db.delete(`users.${user.payload.username}.contents.${postid}`);

        return res.status(200).send({
            success: true,
        });
    });
    //İçerik Beğenme
    router.post('/content/like', async (req, res) => {
        //Düzenlenecek
    });
    //Takip Etme
    router.post('/follow/:username', async (req, res) => {
        let token = req.headers.authorization;
        let { username } = req.params as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let userDB = db.get(`users.${user.payload.username}`);
        let userDB2 = db.get(`users.${username}`);

        if (!userDB || !userDB2) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (userDB.following.includes(username)) {
            return res.status(400).send({
                error: 'Already following',
            });
        }

        db.push(`users.${user.payload.username}.following`, username);
        db.push(`users.${username}.followers`, user.payload.username);

        createNotification(db, username, {
            type: 'follow',
            from: user.payload.username,
            content: 'started following you',
        });

        return res.status(200).send({
            success: true,
        });
    });

    router.delete('/follow/:username', async (req, res) => {
        let token = req.headers.authorization;
        let { username } = req.params as Record<string, any>;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let userDB = db.get(`users.${user.payload.username}`);
        let userDB2 = db.get(`users.${username}`);

        if (!userDB || !userDB2) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!userDB.following.includes(username)) {
            return res.status(400).send({
                error: 'Not following',
            });
        }

        userDB = userDB.following.filter((x: string) => x !== username);
        userDB2 = userDB2.followers.filter(
            (x: string) => x !== (user as JWTVerifyResult).payload.username,
        );

        db.set(`users.${user.payload.username}.following`, userDB);
        db.set(`users.${username}.followers`, userDB2);

        return res.status(200).send({
            success: true,
        });
    });
    router.get('/notification/:username', async (req, res) => {
        let token = req.headers.authorization;
        let { username } = req.params as Record<string, any>;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let notifications = db.get(`users.${username}.notifications`);

        if (!notifications) {
            return res.status(400).send({
                notifications: [],
            });
        }

        return res.status(200).send({
            success: true,
            notifications: notifications,
        });
    });
    done();
}
