import * as expressLoader from './express';

export function init({ expressApp }: { expressApp: any }) {
    expressLoader.init({ app: expressApp });
}

