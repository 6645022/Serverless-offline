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
    


}
