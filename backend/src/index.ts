//Dotenv Setup
import dotenv from 'dotenv';
dotenv.config();

//Project Packages
import fastify from 'fastify';
import { JsonDatabase } from 'wio.db';
import fastifyMultipart from '@fastify/multipart';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import type { HTTPMethods } from 'fastify';
import createLog from './util/createLog';
import fs from 'fs';
import path from 'path';
const app = fastify();

//Database Setup
const db = new JsonDatabase({
    databasePath: './database.json',
});

//Register Plugins
app.register(fastifyMultipart, {
    limits: {
        fileSize: 10000000,
    },
    attachFieldsToBody: true,
});

app.register(fastifyStatic, {
    root: path.resolve('./uploads'),
    prefix: '/file/',
});

const allowedMethods: HTTPMethods[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
app.register(fastifyCors, {
    origin: '*',
    methods: allowedMethods,
    allowedHeaders: ['Content-Type', 'Authorization'],
});

//Routers Loader
const routes = fs.readdirSync('./src/routes');

for (const route of routes) {
    const routeName = route.split('.')[0];
    const routePath = `./routes/${routeName}`;

    app.register((api, _, done) => require(routePath).default.call(null, api, done, db), {
        prefix: `/${routeName}`,
    });
}

(async () => {
    const port = +process.env.SERVER_PORT || 3000;

    await app.listen({ port, host: '0.0.0.0' }, (err) => {
        if (err) {
            throw err;
        }
        createLog('SERVER', `Running on port ${port}`);
        createLog('SERVER', `Allowed Methods: ${allowedMethods.join(', ')}`);
        createLog('DATABASE', `Connected to database`);
    });
})();
