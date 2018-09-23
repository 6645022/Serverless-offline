import {DynamoDB} from '../module/dynamodb'
import {calculateAgeAverage} from '../helper/helper'
const {performance} = require('perf_hooks')
export class User extends DynamoDB {
    constructor() {
        super();
        this.users = [];
        this.ages  = []
    }

    async fetch(user = null){
        try{
            let params = {
                TableName : 'users',
                Limit: 1
            };

            if(user != null){
                params = Object.assign(params,{
                    ExclusiveStartKey: {
                        'userId':user.userId,
                        'name':user.name
                    }
                })
            }

            const startTime = performance.now();
            const result = await this.scan(params);
            const finishTime = performance.now();

            if(result.Items && result.Items.length > 0){
                result.Items[0]['executionTime'] = finishTime - startTime;
                this.users.push(result.Items[0]);

                if(result.Items[0].age){
                    this.ages.push(result.Items[0].age);
                }
                if(result['LastEvaluatedKey']){
                    await this.fetch(result['LastEvaluatedKey'])
                }
            }
            const ageAverage = calculateAgeAverage(this.ages);
            return {users:this.users,ageAverage:ageAverage};

        }catch(err){
            throw err
        }
    }

}
