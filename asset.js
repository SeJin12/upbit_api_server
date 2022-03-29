const request = require('request')
const uuidv4 = require("uuid4")
const sign = require('jsonwebtoken').sign
const crypto = require('crypto')
const queryEncode = require("querystring").encode
const fs =require('fs')

const env = JSON.parse(fs.readFileSync("./env.json"))

const access_key = env.UPBIT_OPEN_API_ACCESS_KEY
const secret_key = env.UPBIT_OPEN_API_SECRET_KEY
const server_url = env.UPBIT_OPEN_API_SERVER_URL

const payload = {
    access_key: access_key,
    nonce: uuidv4(),
}

const token = sign(payload, secret_key)

const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: {Authorization: `Bearer ${token}`},
}

console.log(options.headers)

function getAccounts() {
    var jsonArray = new Array();

    request(options, (error, response, body) => {
        if (error) throw new Error(error)
    
        let statusCode = response.statusCode
        // console.log(`statusCode : ${statusCode}`)
        // console.log(JSON.stringify(body));
        console.log(typeof body)
        console.log(typeof JSON.stringify(body))
        console.log(typeof JSON.parse(body))
        let aa = JSON.parse(body)
        for(idx in aa) {
            jsonArray.push(aa[idx])
        }
        // console.log(jsonArray.length)
        for(a in jsonArray) {
            console.log(jsonArray[a])
        }
    
        return jsonArray
    })
}


module.exports = {
    getAccounts
}