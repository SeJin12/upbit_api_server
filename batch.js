const { default: axios } = require("axios");
const schedule = require("node-schedule");

const { Delete, Find, Save } = require("./database");
const { Market } = require("./schema/market.js");
const { Ticker } = require("./schema/ticker.js");

const Utils = require("./Utils.js");
const { MinuteCandle } = require("./schema/minuteCandle.js");

/**
 * 마켓 종목 동기화. 매일 12시 실행
 */
schedule.scheduleJob("0 0 12 * * *", async function () {
  console.log("스케줄링 시작: 마켓 종목 동기화. 매일 12시 실행");

  const marketList = await Find(Market);

  const data = await axios
    .get("https://api.upbit.com/v1/market/all?isDetails=true")
    .then((res) => res.data);

  if (marketList.length !== data.length) {
    await Delete(Market);
    Save(Market, data);
  }
});

// 현재가 정보를 조회한다.
{
  (async () => {
    // 마켓 코드 조회
    const marketList = await Find(Market);
    
    // 캔들을 가져올 마켓코드만 리스트에 넣음. 나는 원화 거래가 가능한 코인만 조회
    const list = [];
    marketList
      .filter((data) => data.market.includes("KRW-"))
      .map((data) => list.push(data));

    const size = list.length;
    list.sort(function (a, b) {
      if (a.market < b.market) return 1;
      else if (a.market > b.market) return -1;
      return 0;
    });

    let index = 0;
    if (size == 0) return;
    setInterval(async () => {
      const data = await axios
        .get(
          `https://api.upbit.com/v1/ticker/?markets=${list[index].market}`
        )
        .then((res) => {
          // console.log(res.headers["remaining-req"]);
          return res.data;
        });
      for (value in data) {
        data[value].registerDate = new Date();
        Save(Ticker, [data[value]]);
      }

      if (++index == size) index = 0;
    }, 200);
  })();
}



// {
//   (async () => {
//     // 마켓 코드 조회
//     const marketList = await Find(Market);

//     // 캔들을 가져올 마켓코드만 리스트에 넣음. 나는 원화 거래가 가능한 코인만 조회
//     const list = [];
//     marketList
//       .filter((data) => data.market.includes("KRW-"))
//       .map((data) => list.push(data));

//     const size = list.length;
//     list.sort(function (a, b) {
//       if (a.market < b.market) return 1;
//       else if (a.market > b.market) return -1;
//       return 0;
//     });

//     let index = 0;
//     if (size == 0) return;
//     setInterval(async () => {
//       const data = await axios
//         .get(
//           `https://api.upbit.com/v1/candles/minutes/1?market=${list[index].market}&count=1`
//         )
//         .then((res) => {
//           // console.log(res.headers["remaining-req"]);
//           return res.data;
//         });
//       for (value in data) {
//         data[value].registerDate = new Date();
//         Save(MinuteCandle, [data[value]]);
//       }

//       if (++index == size) index = 0;
//     }, 200);
//   })();
// }
