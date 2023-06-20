import type { FastifyInstance } from 'fastify';
import { sign, verify } from '../util/jwt';
import fs from 'fs';
import crypto from 'crypto';

interface verifyBody {
    token: string;
}

export default function Group(router: FastifyInstance, done: Function, db) {
    router.get('/all', async (req, res) => {
        let groups = db.get(`groups`);

        if (!groups) {
            return res.status(400).send({
                error: 'Groups not found',
            });
        }

        return res.status(200).send({
            success: true,
            groups: groups,
        });
    });

    router.get('/:groupname', async (req, res) => {
        let groupname = (req.params as any).groupname;

        if (groupname) {
            let group = db.get(`groups.${groupname}`);

            if (!group) {
                return res.status(400).send({
                    error: 'Group not found',
                });
            }
            group = {
                username: group.username,
                profilePicture: group.profilePicture,
                contents: group.contents,
                users: group.users,
            };

            return res.status(200).send({
                success: true,
                group: group,
            });
        }
        let groups = db.get(`groups`);

        groups = Object.values(groups).map((group: any) => {
            return {
                username: group.username,
                profilePicture: group.profilePicture,
                contents: group.contents,
                users: group.users,
            };
        });

        return res.status(200).send({
            success: true,
            groups: groups,
        });
    });

    //Grup Oluşturma
    router.post('/', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname, profilePicture } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        groupname = groupname.value;

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!groupname || !profilePicture) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let group = db.get(`groups.${groupname}`);

        if (group) {
            return res.status(400).send({
                error: 'Group already exists',
            });
        }

        let file = profilePicture;

        if (!fs.existsSync(`./uploads/`)) {
            fs.mkdirSync(`./uploads/`);
        }

        const fileName = `${Math.floor(Math.random() * 1000000000000)}.${
            file.mimetype.split('/')[1]
        }`;

        await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());

        let creator = db.get(`users.${user.payload.username}`);

        db.set(`groups.${groupname}`, {
            username: groupname,
            profilePicture: fileName,
            contents: {},
            users: [
                {
                    username: creator.username,
                    profilePicture: creator.profilePicture,
                    role: 1,
                },
            ],
        });

        db.set(`users.${user.payload.username}.groups.${groupname}`, {
            username: groupname,
            profilePicture: fileName,
            role: 1,
        });

        return res.status(200).send({
            success: true,
            group: db.get(`groups.${groupname}`),
        });
    });

    //Gruba üye ekleme
    router.post('/:groupname/user', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname } = req.params as any;
        let { username } = req.body as any;

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

        user = db.get(`users.${user.payload.username}`).username;

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!groupname || !username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let group = db.get(`groups.${groupname}`);

        if (!group) {
            return res.status(400).send({
                error: 'Group not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (group.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User already in group',
            });
        }

        if (db.get(`users.${user}.groups.${groupname}`).role === 1) {
            group.users.push({
                username: username,
                profilePicture: userDB.profilePicture,
                role: 0,
            });

            db.set(`groups.${groupname}`, group);

            db.set(`users.${username}.groups.${groupname}`, {
                username: groupname,
                profilePicture: userDB.profilePicture,
                role: 0,
            });

            return res.status(200).send({
                success: true,
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    //Grup üyesi çıkarma
    router.delete('/:groupname/user', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname } = req.params as any;
        let { username } = req.body as any;

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

        user = db.get(`users.${user.payload.username}`).username;

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!groupname || !username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let group = db.get(`groups.${groupname}`);

        if (!group) {
            return res.status(400).send({
                error: 'Group not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!group.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User not in group',
            });
        }

        if (db.get(`users.${user}.groups.${groupname}`).role === 1) {
            group.users = group.users.filter((u) => u.username !== username);

            db.set(`groups.${groupname}`, group);

            db.delete(`users.${username}.groups.${groupname}`);

            return res.status(200).send({
                success: true,
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    //Grup Üye Rolü Değiştirme
    router.patch('/:groupname/user', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname } = req.params as Record<string, any>;
        let { username, role } = req.body as Record<string, any>;

        username = username.value;
        role = role.value;

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

        user = db.get(`users.${user.payload.username}`).username;

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!groupname || !username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let group = db.get(`groups.${groupname}`);

        if (!group) {
            return res.status(400).send({
                error: 'group not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!group.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User not in company',
            });
        }

        if (db.get(`users.${user}.groups.${groupname}`).role === 1) {
            group.users = group.users.filter((u) => u.username !== username);

            group.users.push({
                username: username,
                profilePicture: userDB.profilePicture,
                role: Number(role),
            });

            db.set(`groups.${groupname}`, group);

            db.set(`users.${username}.groups.${groupname}`, {
                username: username,
                profilePicture: userDB.profilePicture,
                role: role,
            });

            return res.status(200).send({
                success: true,
                group: db.get(`groups.${groupname}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    //Grup Düzenleme
    router.patch('/:groupname', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname } = req.params as Record<string, any>;
        let { newGroupname, profilePicture } = req.body as any;

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

        newGroupname = newGroupname.value;

        if (!profilePicture || !newGroupname) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let userDB = db.get(`users.${user.payload.username}`);
        let group = db.get(`groups.${groupname}`);

        if (!group) {
            return res.status(400).send({
                error: 'Group not found',
            });
        }

        if (db.get(`users.${user.payload.username}.groups.${groupname}.role`) !== 1) {
            return res.status(400).send({
                error: 'You are not authorized to do this',
            });
        }

        let fileName;

        if (profilePicture && profilePicture.type === 'file') {
            let file = profilePicture;

            if (!fs.existsSync(`./uploads/`)) {
                fs.mkdirSync(`./uploads/`);
            }

            fileName = `${Math.floor(Math.random() * 1000000000000)}.${
                file.mimetype.split('/')[1]
            }`;

            await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());
        }

        db.delete(`groups.${groupname}`);

        db.set(`groups.${newGroupname}`, {
            username: newGroupname,
            profilePicture: fileName ? fileName : group.profilePicture,
            users: group.users,
            contents: group.contents,
        });

        db.delete(`users.${user.payload.username}.groups.${groupname}`);

        db.set(`users.${user.payload.username}.groups.${newGroupname}`, {
            username: newGroupname,
            profilePicture: fileName ? fileName : group.profilePicture,
            role: 1,
        });

        return res.status(200).send({
            success: true,
            group: db.get(`groups.${newGroupname}`),
        });
    });

    //İçerik Paylaşma
    router.post('/content', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname, content, image } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        groupname = groupname.value;
        content = content.value;

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!groupname || !content || !image) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`groups.${groupname}`);

        if (!company) {
            return res.status(400).send({
                error: 'groups not found',
            });
        }

        if (db.get(`users.${user.payload.username}.groups.${groupname}.role`) == 1) {
            let file = image;

            if (!fs.existsSync(`./uploads/`)) {
                fs.mkdirSync(`./uploads/`);
            }

            const fileName = `${Math.floor(Math.random() * 1000000000000)}.${
                file.mimetype.split('/')[1]
            }`;

            await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());

            let postid = crypto.randomBytes(16).toString('hex');

            db.set(`groups.${groupname}.contents.${postid}`, {
                description: content,
                image: fileName,
                author: user.payload.username,
                userProfilePicture: db.get(`users.${user.payload.username}.profilePicture`),
            });
            return res.status(200).send({
                success: true,
                content: db.get(`groups.${groupname}.contents.${postid}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    //İçerik Silme

    router.delete('/content/:groupname/:postid', async (req, res) => {
        let token = req.headers.authorization;
        let { groupname, postid } = req.params as Record<string, any>;

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

        if (!groupname || !postid) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`groups.${groupname}`);

        if (!company) {
            return res.status(400).send({
                error: 'groups not found',
            });
        }

        if (db.get(`users.${user.payload.username}.groups.${groupname}.role`) == 1) {
            db.delete(`groups.${groupname}.contents.${postid}`);
            return res.status(200).send({
                success: true,
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    done();
}
