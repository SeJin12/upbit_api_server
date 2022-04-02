// const asset = require('./asset')
const express = require('express')
const fs =require('fs')
const bodyParser = require('body-parser')

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send("upbit API Server!")
})

/*
    전체 계좌 조회
    내가 보유한 자산 리스트를 보여줍니다.
*/
app.get('/v1/accounts', function(req, res) {
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
app.get('/v1/api_keys', function(req, res) {
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
    currency, uuids, txids, limit, page, order_by
    출금 상태 (state)
        - submitting : 처리 중
        - submitted : 처리 완료
        - almost_accepted : 출금대기중
        - rejected : 거부
        - accepted : 승인됨
        - processing : 처리 중
        - done : 완료
        - canceled : 취소됨
*/
app.post('/v1/withdraws', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 

    const currency = req.body.currency
    const state = req.body.state
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

/*
    입금 리스트 조회
    currency, uuids, txids, limit, page, order_by(asc/desc)
    입금 상태 (state)
        - submitting : 처리 중
        - submitted : 처리완료
        - almost_accepted : 입금 대기 중
        - rejected : 거절
        - accepted : 승인됨
        - processing : 처리 중
*/
app.post('/v1/deposits', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 

    const currency = req.body.currency
    const state = req.body.state
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
        url: server_url + "/v1/deposits?" + query,
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


/*
    입출금 현황
    입출금 현황 및 블록 상태를 조회합니다.
*/
app.get('/v1/status/wallet', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 
    
    const payload = {
        access_key: access_key,
        nonce: uuidv4(),
    }

    let options = {
        method: "GET",
        url: server_url + '/v1/status/wallet',
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
    Quitation API
*/

/*
    마켓 코드 조회
    업비트에서 거래 가능한 마켓 목록
*/
app.get('/v1/market/all', function(req, res) {
    console.log( req.url + ", TIME : " + (new Date())) 
    
    let options = {
        method: "GET",
        url: server_url + '/v1/market/all?isDetails=true'
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

