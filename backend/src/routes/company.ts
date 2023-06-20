import type { FastifyInstance } from 'fastify';
import { sign, verify } from '../util/jwt';
import fs from 'fs';
import crypto from 'crypto';

interface verifyBody {
    token: string;
}

export default function Company(router: FastifyInstance, done: Function, db) {
    router.get('/all', async (req, res) => {
        let companies = db.get(`companies`);

        if (!companies) {
            return res.status(400).send({
                error: 'Companies not found',
            });
        }

        return res.status(200).send({
            success: true,
            companies: companies,
        });
    });

    router.get('/:companyname', async (req, res) => {
        let companyname = (req.params as any).companyname;

        if (companyname) {
            let company = db.get(`companies.${companyname}`);

            if (!company) {
                return res.status(400).send({
                    error: 'Company not found',
                });
            }
            company = {
                companyname: company.username,
                profilePicture: company.profilePicture,
                contents: company.contents,
                biography: company.biography,
                users: company.users,
            };

            return res.status(200).send({
                success: true,
                company: company,
            });
        } else {
            let companies = db.get(`companies`);

            if (!companies) {
                return res.status(400).send({
                    error: 'Companies not found',
                });
            }

            companies = Object.values(companies);

            return res.status(200).send({
                success: true,
                companies: companies,
            });
        }
    });

    //Şirket Oluşturma
    router.post('/', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname, profilePicture } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        companyname = companyname.value;

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!companyname || !profilePicture) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (company) {
            return res.status(400).send({
                error: 'company already exists',
            });
        }

        let fileName;

        if (profilePicture.length && profilePicture[0].type === 'file') {
            let file = profilePicture;

            if (!fs.existsSync(`./uploads/`)) {
                fs.mkdirSync(`./uploads/`);
            }
            fileName = `${Math.floor(Math.random() * 1000000000000)}.${
                file.mimetype.split('/')[1]
            }`;

            await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());
        }
        let creator = db.get(`users.${user.payload.username}`);

        db.set(`companies.${companyname}`, {
            username: companyname,
            profilePicture: profilePicture.length ? fileName : 'def.avif',
            contents: {},
            users: [
                {
                    username: creator.username,
                    profilePicture: creator.profilePicture,
                    role: 1,
                },
            ],
        });

        db.set(`users.${user.payload.username}.companies.${companyname}`, {
            username: companyname,
            profilePicture: profilePicture.length ? fileName : 'def.avif',
            role: 1,
        });

        return res.status(200).send({
            success: true,
            company: db.get(`companies.${companyname}`),
        });
    });

    //Şirket Düzenleme
    router.patch('/:companyname', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname } = req.params as Record<string, any>;
        let { newCompanyname, profilePicture } = req.body as any;

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

        if (!profilePicture || !newCompanyname) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }
        newCompanyname = newCompanyname.value;

        let userDB = db.get(`users.${user.payload.username}`);
        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'Company not found',
            });
        }

        if (db.get(`users.${user.payload.username}.companies.${companyname}.role`) !== 1) {
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

        db.delete(`companies.${companyname}`);

        db.set(`companies.${newCompanyname}`, {
            username: newCompanyname,
            profilePicture: fileName ? fileName : company.profilePicture,
            users: company.users,
            contents: company.contents,
        });

        db.delete(`users.${user.payload.username}.companies.${companyname}`);

        db.set(`users.${user.payload.username}.companies.${newCompanyname}`, {
            username: newCompanyname,
            profilePicture: fileName ? fileName : company.profilePicture,
            role: 1,
        });

        return res.status(200).send({
            success: true,
            company: db.get(`companies.${newCompanyname}`),
        });
    });

    //İçerik Oluşturma
    router.post('/content', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname, content, image } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        companyname = companyname.value;
        content = content.value;

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!companyname || !content || !image) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'Company not found',
            });
        }

        let postid = crypto.randomBytes(16).toString('hex');

        if (db.get(`users.${user.payload.username}.companies.${companyname}.role`) == 1) {
            let file = image;

            if (!fs.existsSync(`./uploads/`)) {
                fs.mkdirSync(`./uploads/`);
            }

            const fileName = `${Math.floor(Math.random() * 1000000000000)}.${
                file.mimetype.split('/')[1]
            }`;

            await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());

            db.set(`companies.${companyname}.contents.${postid}`, {
                description: content,
                image: fileName,
                author: user.payload.username,
                userProfilePicture: db.get(`users.${user.payload.username}.profilePicture`),
            });
            return res.status(200).send({
                success: true,
                content: db.get(`companies.${companyname}.contents.${postid}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    //İçerik Silme
    router.delete('/content/:companyname/:postid', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname, postid } = req.params as Record<string, any>;

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

        if (!companyname || !postid) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'company not found',
            });
        }

        if (db.get(`users.${user.payload.username}.companies.${companyname}.role`) == 1) {
            db.delete(`companies.${companyname}.contents.${postid}`);
            return res.status(200).send({
                success: true,
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    router.patch('/role', async (req, res) => {
        let token = req.headers.authorization;

        let { companyname, username, role } = req.body as any;

        companyname = companyname.value;
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

        if (!companyname || !username || !role) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'company not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!company.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User not in company',
            });
        }

        if (db.get(`users.${user}.companies.${companyname}`).role === 1) {
            company.users = company.users.filter((u) => u.username !== username);

            company.users.push({
                username: username,
                profilePicture: userDB.profilePicture,
                role: role,
            });

            db.set(`companies.${companyname}`, company);

            db.set(`users.${username}.companies.${companyname}`, {
                username: username,
                profilePicture: userDB.profilePicture,
                role: role,
            });

            return res.status(200).send({
                success: true,
                company: db.get(`companies.${companyname}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    router.post('/:companyname/user', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname } = req.params as Record<string, any>;
        let { username, role } = req.body as any;

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
        if (!username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'company not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (company.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User already in company',
            });
        }

        if (db.get(`users.${user}.companies.${companyname}`).role === 1) {
            company.users.push({
                username: username,
                profilePicture: userDB.profilePicture,
                role: 0,
            });

            db.set(`companies.${companyname}`, company);

            db.set(`users.${username}.companies.${companyname}`, {
                username: username,
                profilePicture: userDB.profilePicture,
                role: 0,
            });

            return res.status(200).send({
                success: true,
                company: db.get(`companies.${companyname}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    //Üyelikten Çıkma
    router.delete('/:companyname/user', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname } = req.params as Record<string, any>;
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

        if (!username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'company not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!company.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User not in company',
            });
        }

        if (db.get(`users.${user}.companies.${companyname}`).role === 1) {
            company.users = company.users.filter((u) => u.username !== username);

            db.set(`companies.${companyname}`, company);

            db.delete(`users.${username}.companies.${companyname}`);

            return res.status(200).send({
                success: true,
                company: db.get(`companies.${companyname}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    router.patch('/:companyname/user', async (req, res) => {
        let token = req.headers.authorization;
        let { companyname } = req.params as Record<string, any>;
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

        if (!companyname || !username) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let company = db.get(`companies.${companyname}`);

        if (!company) {
            return res.status(400).send({
                error: 'company not found',
            });
        }

        let userDB = db.get(`users.${username}`);

        if (!userDB) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        if (!company.users.find((u) => u.username === username)) {
            return res.status(400).send({
                error: 'User not in company',
            });
        }

        if (db.get(`users.${user}.companies.${companyname}`).role === 1) {
            company.users = company.users.filter((u) => u.username !== username);

            company.users.push({
                username: username,
                profilePicture: userDB.profilePicture,
                role: Number(role),
            });

            db.set(`companies.${companyname}`, company);

            db.set(`users.${username}.companies.${companyname}`, {
                username: username,
                profilePicture: userDB.profilePicture,
                role: role,
            });

            return res.status(200).send({
                success: true,
                company: db.get(`companies.${companyname}`),
            });
        }

        return res.status(400).send({
            error: 'You are not authorized to do this',
        });
    });

    done();
}
