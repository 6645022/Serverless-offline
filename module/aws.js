var AWS = require('aws-sdk');
import env from '../config/env'

export class Aws {
    constructor() {
        this.aws = AWS;
        this.aws.config.update(env.dev);
    }
}