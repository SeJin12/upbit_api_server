// const asset = require('./asset')
const express = require('express')
const fs =require('fs')

// 
const request = require('request')
const uuidv4 = require("uuid4")
const sign = require('jsonwebtoken').sign
const crypto = require('crypto')
const queryEncode = require("querystring").encode


const env = JSON.parse(fs.readFileSync("./env.json"))

const access_key = env.UPBIT_OPEN_API_ACCESS_KEY
const secret_key = env.UPBIT_OPEN_API_SECRET_KEY
const server_url = env.UPBIT_OPEN_API_SERVER_URL

// Server
const app = express()

app.get('/', function(req, res) {
    res.send("hello!")
})

/*
    전체 계좌 조회
    내가 보유한 자산 리스트를 보여줍니다.
*/
app.get('/asset', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 

    const payload = {
        access_key: access_key,
        nonce: uuidv4(),
    }

    let options = {
        method: "GET",
        url: server_url + '/v1/accounts',
        headers: {Authorization: `Bearer ${sign(payload, secret_key)}`},
    }
    
    request(options, (error, response, body) => {
        if (error) throw new Error(error)
    
        let statusCode = response.statusCode
        console.log(statusCode)
        res.send(JSON.parse(body))
    })
})

/*
    API 키 리스트 조회
    API 키 목록 및 만료 일자를 조회합니다.
*/
app.get('/api_keys', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 
    
    const payload = {
        access_key: access_key,
        nonce: uuidv4(),
    }

    let options = {
        method: "GET",
        url: server_url + '/v1/api_keys',
        headers: {Authorization: `Bearer ${sign(payload, secret_key)}`},
    }

    request(options, (error, response, body) => {
        if (error) throw new Error(error)
    
        let statusCode = response.statusCode
        console.log(statusCode)
        res.send(JSON.parse(body))
    })
})

/*
    출금 리스트 조회
*/
app.get('/withdraws/:currency', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 

    const currency = req.params.currency
    const state = 'done'
    const txids = [
      
    ]

    const non_array_body = {
        currency: currency,
        state: state,
    }
    const array_body = {
        txids: txids,
    }
    const body = {
        ...non_array_body,
        ...array_body
    }

    const txid_query = txids.map(txid => `txids[]=${txid}`).join('&')
    const query = queryEncode(non_array_body) + '&' + txid_query

    const hash = crypto.createHash('sha512')
    const queryHash = hash.update(query, 'utf-8').digest('hex')

    const payload = {
        access_key: access_key,
        nonce: uuidv4(),
        query_hash: queryHash,
        query_hash_alg: 'SHA512',
    }

    let options = {
        method: "GET",
        url: server_url + "/v1/withdraws?" + query,
        headers: {Authorization: `Bearer ${sign(payload, secret_key)}`,
        json: body},
    }


    request(options, (error, response, body) => {
        if (error) throw new Error(error)
    
        let statusCode = response.statusCode
        console.log(statusCode)
        res.send(JSON.parse(body))
    })
})

app.listen(3000, function() {
    console.log("start! node server");
})

