# upbit_api_server

업비트 OpenAPI 활용하여 서버 개발하기
> 많은 Client 요청이 업비트 API를 직접 호출하다보니 요청 제한 횟수(`429 Too Many Requests`) 때문에, 문제가 발생 😡 <br>
> 서버 스케줄링(batch 작업)을 통해 MongoDB에 데이터를 저장

[업비트 OpenAPI](https://docs.upbit.com/reference)

## 📋 기술 스택 
- javascript + NodeJS
- MongoDB
- axios, mongoose, node-schedule(batch)


***

> NodeJS + MongoDB 데이터 다루기


```bash
# npm 설치
npm install mongoose
```

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/databaseName"); // database name: project

// 아래 db 코드는 확인할 때 사용한다. 코드 생략 가능
const db = mongoose.connection;
db.on("open", function () {
  console.log("Connected");
});
db.on("error", function () {
  console.log("Connection Failed!");
});

/**
 * 최초 데이터 1건을 조회한다. (가장 오래된 데이터)
 * @param {mongoose.Schema} schema
 * @param {object} filter
 * @returns
 */
const FindFirst = async (schema, filter) => {
  return await schema
    .findOne(filter)
    .then((response) => response)
    .catch((error) => error);
};

/**
 * 데이터를 저장한다.
 * @param {mongoose.Schema} schema
 * @param {object[]} data
 */
const Save = (schema, data) => {
  for (value in data) {
    new schema(data[value])
      .save()
      .then((response) => response)
      .catch((error) => error);
  }
};
/**
 * 데이터를 조회하고, 최신순으로 조회한다.
 * @param {mongoose.Schema} schema
 * @param {object} filter
 * @param {number} limit
 * @returns
 */
const Find = async (schema, filter = undefined, limit = undefined) => {
  return await schema
    .find(filter)
    .sort({ _id: -1 })
    .limit(limit)
    .then((response) => response)
    .catch((error) => error);
};

/**
 * 데이터를 삭제한다.
 * @param {mongoose.Schema} schema
 * @param {object[]} data
 * @returns { acknowledged: boolean, deletedCount: number }
 */
const Delete = async (schema, filter = undefined) => {
  return await schema.deleteMany(filter)
    .then((response) => response)
    .catch((error) => error);
};

// mongoose 조회 함수 호출하기
( async () => {
  const returnDelete = await Delete(Ticker);
  console.log(returnDelete.deletedCount);
}) ();
```

Schema.js
```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticker = new Schema({
  name: string
});

const Ticker = mongoose.model("tickers", ticker);

module.exports = {
  Ticker,
};
```

### Reference Site

<hr/>

[mongoose guide](https://mongoosejs.com/docs/guide.html)
