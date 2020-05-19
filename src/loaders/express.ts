import { Application } from 'express';

export function init({ app }: { app: Application }) {
    app.get('/', (req, res) => {
        res.status(200).end()
    });
    return app;
}

