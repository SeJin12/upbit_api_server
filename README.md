# upbit_api_server

> 업비트 OpenAPI 활용하여 서버 개발하기
>> 많은 Client 요청이 업비트 API를 직접 호출하다보니 요청 제한 횟수(`429 Too Many Requests`) 때문에, 문제가 발생 😡 <br>
>> 서버 스케줄링(batch 작업)을 통해 MongoDB에 데이터를 저장

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

mongoose.connect("mongodb://127.0.0.1:27017/project"); // database name: project

const db = mongoose.connection;

db.on("open", function () {
  console.log("Connected");
});

db.on("error", function () {
  console.log("Connection Failed!");
});

// Schema 생성
const foo = mongoose.Schema({
  name: "string",
  age: "number",
});

// DB: project ,  collection: foo  연결
const Foo = mongoose.model("foo", foo);

/*  데이터 저장
    input parameter: data 는 객체 배열
    [{name: 'foo1', age: 25}] 또는 [ {name: 'foo1', age: 25}, {name: 'foo2', age: 30}, ... ]
*/
const insert = (data) => {
  for (value in data) {
    new Foo(data[value]).save(function (error, data) {
      if (error) {
        console.log("failed");
      } else {
        console.log("Success");
      }
    });
  }
};

// 데이터 조회
// 방법 1. collection 데이터 전체 조회
const findAll = async () => {
  return await Foo.find(function (error, data) {
    if (error) {
      return error;
    } else {
      return data;
    }
  }).clone();
  /*
    MongooseError: Query was already executed
    findAll() 함수로 데이터를 받아오는 과정에서 위와 같은 오류가 발생했다
    clone() 을 추가하여 해결하였음
  */
};

// 방법 2.  filter ex.  { age : 30 }
const findFilter = async (filter) => {
  return await Foo.find(filter)
    .sort({ _id: -1 }) // -1 : 최신 데이터부터,  1 : 오래된 데이터부터
    .limit(1) // 1건만 조회
    .then((res) => res)
    .catch((e) => e);
};

// 방법 3. 1건만 조회 (최초 생성 데이터만 조회되었음)
const findOne = async (filter) => {
  return await Foo.findOne(filter, function (error, data) {
    if (error) {
      return error;
    } else {
      return data;
    }
  });
};

// 데이터 전체 삭제
// return: { acknowledged: true, deletedCount: 0 }
const deleteAll = async () => {
    return await Foo.deleteMany();
}

// mongoose 조회 함수 호출하기
( async () => {
  const console1 = await findAll(); // 전체 조회
  console.log(console1);

  const console2 = await deleteAll(); // 전체 삭제
  console.log(console2);
}) ();

```

### Reference Site

<hr/>

[mongoose guide](https://mongoosejs.com/docs/guide.html)
