import {Aws} from "./aws";


export class DynamoDB extends Aws{
    constructor() {
        super();
        this.docClient = new this.aws.DynamoDB.DocumentClient();
    }


    async scan(params){
        try {
            let response = await this.docClient.scan(params).promise();
            return response
        }
        catch(error) {
            return error;
        }
    }
    async query(params){
        console.log(213123)

        try {
            let response = await this.docClient.query(params).promise();
            return response
        }
        catch(error) {
            return error;
        }
    }

    async put(){
        var params = {
            TableName : 'users',
            Key: {
                HashKey: 'userId'
            }
        };
        await this.docClient.get(params, function(err, data) {
            if (err) console.log(err);
            else console.log(data);
        });
    }
}