import type { FastifyInstance } from 'fastify';
import { sign, verify } from '../util/jwt';
import fs from 'fs';

interface verifyBody {
    token: string;
}

export default function Event(router: FastifyInstance, done: Function, db) {
    router.get('/:eventname', async (req, res) => {
        let eventname = (req.params as any).eventname;

        let event = db.get(`events.${eventname}`);

        if (!event) {
            return res.status(400).send({
                error: 'Event not found',
            });
        }
        event = {
            username: event.username,
            profilePicture: event.profilePicture,
            contents: event.contents,
            users: event.users,
        };

        return res.status(200).send({
            success: true,
            event: event,
        });
    });

    //Etkinlik Oluşturma
    router.post('/', async (req, res) => {
        let token = req.headers.authorization;
        let { eventname, profilePicture } = req.body as any;

        if (!token) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        eventname = eventname.value;

        let user = await verify(token);

        if (!user) {
            return res.status(400).send({
                error: 'Invalid authorization token',
            });
        }

        if (!eventname || !profilePicture) {
            return res.status(400).send({
                error: 'Invalid body',
            });
        }

        let event = db.get(`events.${eventname}`);

        if (event) {
            return res.status(400).send({
                error: 'Event already exists',
            });
        }

        let file = profilePicture;

        if (!fs.existsSync(`./uploads/`)) {
            fs.mkdirSync(`./uploads/`);
        }

        let creator = db.get(`users.${user.payload.username}`);

        const fileName = `${Math.floor(Math.random() * 1000000000000)}.${
            file.mimetype.split('/')[1]
        }`;

        await fs.writeFileSync(`./uploads/${fileName}`, await file.toBuffer());

        db.set(`events.${eventname}`, {
            eventname: eventname,
            profilePicture: fileName,
            contents: [],
            users: [
                {
                    username: creator.username,
                    profilePicture: creator.profilePicture,
                },
            ],
        });

        db.set(`users.${user.payload.username}.events.${eventname}`, {
            eventname: eventname,
            profilePicture: fileName,
        });

        return res.status(200).send({
            success: true,
            event: {
                eventname: eventname,
                profilePicture: fileName,
                contents: [],
                users: [
                    {
                        username: creator.username,
                        profilePicture: creator.profilePicture,
                    },
                ],
            },
        });
    });

    done();
}
