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

# Docker 

## NodeJS 이미지 빌드 & 컨테이너 실행
### Dockerfile
```docker
# syntax=docker/dockerfile:1
FROM node:16.14.2
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY . .
CMD ["node", "server.js"]
```
> `syntax` : 파서 지시문. 선택 사항이지만 이 지시문은 Docker 파일을 구문 분석할 때 사용할 구문을 Docker 빌더에 지시하고 BuildKit이 활성화된 이전 Docker 버전이 빌드를 시작하기 전에 구문 분석기를 업그레이드할 수 있도록 합니다. 구문 분석기 지시문은 Dockerfile의 다른 주석, 공백 또는 Dockerfile 명령 앞에 나타나야 하며 Dockerfile의 첫번째 줄에 있어야 한다 <br>
> `FROM` : 사용할 이미지를 선언하며, 개발환경와 동일한 버전(`# node -v`)으로 설정 <br>
> `ENV` : `NODE_ENV` 환경 변수는 애플리케이션이 실행되는 환경(일반적으로 개발 또는 프로덕션)을 지정합니다 . 성능을 향상시키기 위해 할 수 있는 가장 간단한 작업 중 하나는 로 설정 `NODE_ENV` 변수를 `production`으로 설정 <br>
> `WORKDIR` : Docker가 이 경로를 기본 위치로 사용하도록 지시. 이렇게 하면 전체 파일 경로를 입력할 필요가 없고, 작업 디렉터리를 기반으로 하는 상대 경로를 사용할 수 있다 <br>
> `COPY` : Docker에 파일들을 복사한다. 첫번째 매개변수는 Docker로 복사하려는 파일이고 두번째 매개변수는 파일이 복사될 Docker 위치(`<dest>`). 만약 배열을 사용한다면 마지막 매개변수는 `<dest>`이고, 나머지 매개변수는 복사할 파일을 지정하여 선언 <br>
> `RUN` : 명령어를 사용. 앞에서 복사한 `package.json` 종속된 모듈을 설치했다 <br>
> `CMD` : 컨테이너 내부에서 실행될 때 실행할 명령을 Docker에 알려준다

### .dockerignore
```
node_modules
```
> Docker 빌드 시, 제외될 파일을 선언

### Docker Image Build
```bash
$ docker build --tag api-server .
[+] Building 61.5s (16/16) FINISHED                                                                                  
 => [internal] load build definition from Dockerfile                                                            0.0s
 => => transferring dockerfile: 241B                                                                            0.0s
 => [internal] load .dockerignore                                                                               0.0s
...
 => exporting to image                                                                                          2.4s
 => => exporting layers                                                                                         2.4s
 => => writing image sha256:c0fae47b01ad1466f12e0361f388aacb4a68e79187c66a73f4612b1bcf522bd0                    0.0s
 => => naming to docker.io/library/api-server                                                                   0.0s
```
### Docker 이미지 확인
```bash
$ docker images                                                             
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
api-server    latest    c0fae47b01ad   11 seconds ago   965MB
```
### Docker 이미지 태그 생성, 삭제
```bash
$ docker tag api-server:latest api-server:v1.0.0   
$ docker images                                                                                                                                                                                                                 02:24:38
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
api-server    latest    c0fae47b01ad   29 minutes ago   965MB
api-server    v1.0.0    c0fae47b01ad   29 minutes ago   965MB
$ docker rmi api-server:latest                                                                                                                                                                                                  02:24:40
Untagged: api-server:latest
$ docker images                                                                                                                                                                                                                 02:26:24
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
api-server    v1.0.0    c0fae47b01ad   31 minutes ago   965MB
```
### Docker 컨테이너
```bash
# tag를 지정하지 않으면 api-server:latest로 실행
$ docker run --publish 8000:8000 api-server:v1.0.0
# Run in detached mode (Daemon Process)
$ docker run -dp 8000:8000 api-server:v1.0.0
```
```bash
# 실행중인 컨테이너
$ docker ps
CONTAINER ID   IMAGE               COMMAND                  CREATED          STATUS          PORTS                    NAMES
3a419049d5eb   api-server:v1.0.0   "docker-entrypoint.s…"   31 seconds ago   Up 30 seconds   0.0.0.0:8000->8000/tcp   happy_poitras
# 컨테이너 실행 기록  --all or -a
$ docker ps --all
# docker stop, start, restart <NAMES>
$ docker stop happy_poitras 
# 컨테이너 제거
docker rm <NAMES1> <NAMES2> ...
# 컨테이너 이름 지정 후 실행
$ docker run -dp 8080:8080 --name backend api-server:v1.0.0                                                                                                                                                                     02:40:43
77e3745b287301a0bc099e4869200b31af011b7cf31ad91c41bbed7216944b12
$ docker ps -a                                                                                                                                                                                                                  02:41:23
CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS         PORTS                    NAMES
77e3745b2873   api-server:v1.0.0   "docker-entrypoint.s…"   4 seconds ago   Up 4 seconds   0.0.0.0:8080->8080/tcp   backend
```

## 데이터베이스 MongoDB 컨테이너
```bash
# 볼륨 생성
$ docker volume create mongodb
$ docker volume create mongodb_config
# app <-> db 서로 통신하는데 사용할 네트워크 생성
$ docker network create mongodb
# Docker Hub에서 mongodb 이미지를 가져와 사용
$ docker run -it --rm -d -v mongodb:/data/db \
  -v mongodb_config:/data/configdb -p 27017:27017 \
  --network mongodb \
  --name mongodb \
  mongo
       # 127.0.0.1:27017 => mongo:27017
# api server 컨테이너 실행
$ docker run -it --rm -d --network mongodb --name backend -p 8000:8000 -e CONNECTIONSTRING=mongodb://mongodb:27017 api-server:v1.0.0    
```
## Docker Compose (image build & Container 명령어 필요 X)
```bash
$ docker-compose up -d --build
```
* `-d` 백그라운드에서 작동합니다 <br>
* `--build` Docker가 이미지를 컴파일한 다음 시작합니다
```bash
$ docker-compose up
```
- 빌드를 하지않고, 빌드되어있는 이미지로 시작합니다
```bash
# file: docker-compose.dev.yml
$ docker-compose -f <file> up
```
- 지정한 compose 파일을 실행합니다
- `-f <file>` 명령어가 없다면, `default` docker-compose.yml 을 실행합니다
<br>
### [Tag가 없는 (none) 이미지 삭제하기](https://jhkimmm.tistory.com/9)
```bash
docker rmi -f $(docker images -f "dangling=true" -q)
```
- `rmi -f` 이미지를 강제로 삭제. Stopped된 컨테이너에서 해당 이미지를 사용하고 있어 삭제할 수 없는 경우 사용
```bash
docker rm $(docker ps --filter status=exited -q)
```
- Exited 상태인 컨테이너를 모두 삭제
- 이미지 상태가 none이 아닌 Exited 상태의 컨테이너도 삭제하기 때문에 주의하여 사용
<br><br>
***
## MongoDB - Mongoose 


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
