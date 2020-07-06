import { Application } from 'express';
import { kinesisProducer } from "../kinessis/producer/app";

export function init({ app }: { app: Application }) {
    app.get('/', (req, res) => {
        kinesisProducer.enqueueRecord({
            title: `${new Date()}, title`,
        });
        res.status(200).end()
    });
    return app;
}

