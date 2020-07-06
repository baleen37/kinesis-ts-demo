import _ from 'lodash';
import AWS, { Kinesis } from "aws-sdk";
import { PutRecordsRequestEntryList } from "aws-sdk/clients/kinesis";

const log = {
    info: (data: string) => {
        console.info(data);
    },
    error: (data: any) => {
        console.error(data);
    }
}

function sleep(ms: number) {
    return new Promise((resolve => setTimeout(resolve, ms)));
}

interface KinesisRecord {
    title: string;
}

export class KinesisProducer {
    private config: any;
    private kinesis: Kinesis;
    private enqueue: KinesisRecord[];

    constructor(config: any) {
        this.kinesis = new AWS.Kinesis({ region: 'ap-northeast-2' });
        this.config = config;
        this.enqueue = [];
    }

    enqueueRecord(record: KinesisRecord) {
        this.enqueue.push(record);
    }

    _putRecords(record_list: KinesisRecord[]) {
        if (_.isEmpty(record_list)) {
            return;
        }

        const entry_list: PutRecordsRequestEntryList = _.map(record_list, (r) => {
            const currTime = new Date().getMilliseconds();
            const partition_key = 'sensor-' + Math.floor(Math.random() * 100000);
            const data = {
                log_time: currTime,
                title: r.title,
            }
            return {
                Data: JSON.stringify(data),
                PartitionKey: partition_key,
            }
        })

        this.kinesis.putRecords({
            Records: entry_list,
            StreamName: this.config.stream,
        }, function (err, data) {
            if (err) {
                log.error(err);
            } else {
                log.info('Successfully sent data to Kinesis.');
            }
        });
    }

    async _putRecordsJob() {
        log.info(`putRecordsJob, length: ${this.enqueue.length}`);
        // FIXME : 동시성 보장 필요
        this._putRecords(this.enqueue);
        this.enqueue = [];
    }

    async run() {
        while (true) {
            await sleep(5000);
            await this._putRecordsJob();
        }
    }
}
