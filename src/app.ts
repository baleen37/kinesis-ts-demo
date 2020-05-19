import * as loaders from './loaders';
import express from 'express';

async function startServer() {
    const app = express();

    loaders.init({ expressApp: app });

    app.listen(process.env.PORT, err => {
        if (err) {
            console.log(err);
        }

        console.log('ready');
    })
}

startServer();
