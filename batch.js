import axios from "axios";
import schedule from "node-schedule";
import { Delete, Find, Save } from "./database.js";
import { Market } from "./schema/market.js";
import { Ticker } from "./schema/ticker.js";
import { defaultGet } from "./AxiosUtils/Http.js";

// import { getRemainRequest } from "./Utils.js";

/**
 * 마켓 종목 동기화. 
 */
schedule.scheduleJob("0 * * * * *", async function () {
  console.log("스케줄링 시작: 마켓 종목 동기화.");

  const marketList = await Find(Market);

  const response = await defaultGet(
    "https://api.upbit.com/v1/market/all?isDetails=true"
  );

  if (marketList.length !== response.data.length) {
    await Delete(Market);
    Save(Market, response.data);
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
        .get(`https://api.upbit.com/v1/ticker/?markets=${list[index].market}`)
        .then((res) => {
          // console.log(res.headers["remaining-req"]);
          return res.data;
        });

        data.forEach(element => {
          Save(Ticker, [element]);
        });
        

      if (++index == size) index = 0;
    }, 200);
  })();
}
