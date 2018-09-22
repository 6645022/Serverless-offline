import {User} from "./model/user";
module.exports.user = async ()=>{
    const response = await new User().fetch();

    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
}