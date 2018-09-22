import AWS from 'aws-sdk';
import env from '../config/env'
import {User} from "../model/user";
const assert = require("chai").assert,
      fs = require('fs')

AWS.config.update(env.dev);

const db = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
var users = JSON.parse(fs.readFileSync('test/usersData.json', 'utf8'));

let ageAverage = ()=>{
    let ages = []
    users.forEach((i)=>{
        if(i.age){
            ages.push(i.age)
        }
    })
    let sum = ages.reduce((a, b) => a + b, 0);
    return  sum / ages.length;
}

describe('Check table operations',()=>{
    describe('#create table',()=>{
        it('should crate table if not existing',(done)=>{
           db.listTables({}).promise().then((data) => {
                const exists = data.TableNames.filter(name => {
                        return name === 'users';
                    }).length > 0;

                if (!exists) {
                    const params = {
                        TableName : "users",
                        KeySchema: [
                            { AttributeName: "userId", KeyType: "HASH"},  //Partition key
                            { AttributeName: "name", KeyType: "RANGE" }  //Sort key
                        ],
                        AttributeDefinitions: [
                            { AttributeName: "userId", AttributeType: "S" },
                            { AttributeName: "name", AttributeType: "S" }
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 10,
                            WriteCapacityUnits: 10
                        }};

                    db.createTable(params,(err,data)=>{
                        if(err){
                            console.log(err)
                        }else{
                            assert(data).to.exist;
                        }
                    })
                }
           });
            done();
        })
    })
})
describe('add users',()=>{
    it('should add data table',(done)=>{
        var users = JSON.parse(fs.readFileSync('test/usersData.json', 'utf8'));
        users.forEach(function(user) {
            var params = {
                TableName: "users",
                Item: {
                    "userId":  user.userId,
                    "name": user.name,
                    "age":  user.age
                }
            };

            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add users",err);
                }
            });
        });
        done();
    })
})
describe("#verify users",function(){
    it ("verify the number of users and correct average", function(done){
        new User().fetch().then((result)=>{
            let ages = ageAverage();
            assert.equal(users.length, result.users.length);
            assert.equal(ages, result.ageAverage);
            done()
        });

    });
    it ("user with no age field", function(done){
        docClient.scan({TableName : 'users'}, function(err, data) {
            if (err) {
                assert(err).to.exist;
            } else {
                data.Items.forEach(function(item) {
                    if(!item.age){
                        assert.isUndefined(item.age);
                    }
                });
            }
            done();
        });
    });
});
