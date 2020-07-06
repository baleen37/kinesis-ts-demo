import { KinesisProducer } from './producer';
import config from './config';

export const kinesisProducer = new KinesisProducer(config.sampleProducer);

kinesisProducer.run();
