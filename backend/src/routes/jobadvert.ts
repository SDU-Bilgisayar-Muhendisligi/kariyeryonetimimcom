import type { FastifyInstance } from 'fastify';
import { sign, verify } from '../util/jwt';
import crypto from 'crypto';
import fs from 'fs';

interface verifyBody {
    token: string;
}

export default function JobAdvertisements(router: FastifyInstance, done: Function, db) {
    router.get('/:jobadvertisementid', async (req, res) => {
        let jobadvertisementid = (req.params as any).jobadvertisementid;

        if (!jobadvertisementid) {
            return res.status(400).send({
                succes: true,
                jobadvertisements: db.get('jobadvertisements'),
            });
        }
        let jobadvertisement = db.get(`jobadvertisements.${jobadvertisementid}`);

        if (!jobadvertisement) {
            return res.status(400).send({
                error: 'Job Advertisement not found',
            });
        }

        return res.status(200).send({
            success: true,
            jobadvertisement: jobadvertisement,
        });
    });

    //İş İlanı Oluşturma
    router.post('/', async (req, res) => {
        let token = req.headers.authorization;
        let { description, image } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Token not found',
            });
        }

        let decoded = (await verify(token)) as any;

        if (!decoded) {
            return res.status(400).send({
                error: 'Token not found',
            });
        }

        let user = db.get(`users.${decoded.payload.username}`);

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        description = description.value;

        let jobadvertisement = db.get(`jobadvertisements`);
        if (!jobadvertisement) {
            db.set(`jobadvertisements`, {});
        }
        jobadvertisement = Object.values(jobadvertisement).find(
            (jobadvertisement: any) => jobadvertisement.description === description,
        );

        if (jobadvertisement) {
            return res.status(400).send({
                error: 'Job Advertisement already exists',
            });
        }

        let file = image;

        if (!fs.existsSync(`./uploads/`)) {
            fs.mkdirSync(`./uploads/`);
        }

        const fileName = `${Math.floor(Math.random() * 1000000000000)}.${
            file.mimetype.split('/')[1]
        }`;

        await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());

        let postid = crypto.randomBytes(16).toString('hex');

        db.set(`jobadvertisements.${user.username}.advertisement.${postid}`, {
            description: description,
            image: fileName,
            author: user.username,
            userProfilePicture: db.get(`users.${user.username}.profilePicture`),
            postid: postid,
        });
        return res.status(200).send({
            success: true,
            content: db.get(`jobadvertisements.${user.username}.advertisement.${postid}`),
        });
    });

    //Kendi ilanlarım
    router.get('/my', async (req, res) => {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(400).send({
                error: 'Token not found',
            });
        }

        let decoded = (await verify(token)) as any;

        if (!decoded) {
            return res.status(400).send({
                error: 'Token not found',
            });
        }
        let user = db.get(`users.${decoded.payload.username}`);

        if (!user) {
            return res.status(400).send({
                error: 'User not found',
            });
        }

        let jobadvertisements = db.get(
            `jobadvertisements.${decoded.payload.username}.advertisement`,
        );

        if (!jobadvertisements) {
            return res.status(400).send({
                error: 'Job Advertisement not found',
            });
        }

        return res.status(200).send({
            success: true,
            jobadvertisements: jobadvertisements,
        });
    });

    done();
}
