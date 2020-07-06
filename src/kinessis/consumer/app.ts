const kcl = require('aws-kcl');
const bluebird = require('bluebird');
const util = require('util');
let fs = require('fs');

fs = bluebird.promisifyAll(fs);

class RecordProcessor {
    async initialize(initializeInput, completeCallback) {
        await fs.writeFileAsync('test.txt', "Initializing\n");
        completeCallback();
        return;

    }

    async processRecords(processRecordsInput, completeCallback) {
        await fs.appendFileAsync('test.txt', "Processing\n");
        if (!processRecordsInput || !processRecordsInput.records) {
            // Must call completeCallback to proceed further.
            completeCallback();
            return;
        }

        const records = processRecordsInput.records;

        for (const { sequenceNumber, data } of records) {
            const dataString = new Buffer(data, 'base64').toString();
            if (!sequenceNumber) {
                // Must call completeCallback to proceed further.
                completeCallback();
                return;
            }
            // If checkpointing, only call completeCallback once checkpoint operation
            // is complete.
            processRecordsInput.checkpointer.checkpoint(sequenceNumber,
                function (err, checkpointedSequenceNumber) {
                    // In this example, regardless of error, we mark processRecords
                    // complete to proceed further with more records.
                    completeCallback();
                }
            );
        }
    }

    async shutdown(shutdownInput, completeCallback) {
        await fs.appendFileAsync('test.txt', "Shutting Down\n");

        if (shutdownInput.reason !== 'TERMINATE') {
            completeCallback();
            return;
        }
        // Since you are checkpointing, only call completeCallback once the checkpoint
        // operation is complete.
        shutdownInput.checkpointer.checkpoint(function (err) {
            // In this example, regardless of error, we mark the shutdown operation
            // complete.
            completeCallback();
        });
    }
}

const recordProcessor = new RecordProcessor();
kcl(recordProcessor).run();
