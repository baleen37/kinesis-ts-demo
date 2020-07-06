export default {
    kinesis : {
        region : 'ap-northeast-2'
    },

    sampleProducer : {
        stream : 'jiho-altoids',
        shards : 2,
        waitBetweenDescribeCallsInSeconds : 5
    }
}
