const { default: axios } = require("axios");
const schedule = require("node-schedule");
const Utils = require("./Utils.js");
const {
  findMarket,
  deleteAllMarkets,
  insertMarket,
  insertMinuteCandle,
  findCandleMarket,
} = require("./database");

/**
 * 마켓 종목 동기화. 매일 12시 실행
 */
schedule.scheduleJob("0 0 12 * * *", async function () {
  console.log("getmarket");

  const markets = await findMarket();

  const data = await axios
    .get("https://api.upbit.com/v1/market/all?isDetails=true")
    .then((res) => res.data);

  if (markets.length !== data.length) {
    await deleteAllMarkets();
    insertMarket(data);
  }
});

{
  (async () => {
    const markets = await findMarket();
    const list = [];
    markets
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
          `https://api.upbit.com/v1/candles/minutes/1?market=${list[index].market}&count=1`
        )
        .then((res) => {
          console.log(res.headers["remaining-req"]);
          // Utils.getRemainRequest(res);
          return res.data;
        });
      for (value in data) {
        data[value].registerDate = new Date();
        insertMinuteCandle([data[value]]);
      }

      console.log(index, " : ", list[index].market);
      index++;
      if (index == size) index = 0;
    }, 200);
  })();
}
