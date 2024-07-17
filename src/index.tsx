import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import axios from 'axios';

export const app = new Frog({
  title:'cocntut-stats',
  imageOptions: {
    fonts: [
      {
        name: 'VT323',
        weight: 400,
        source: 'google',
      },
    ],
  },
});

app.frame('/', async (c) => {
  const { buttonValue, status, inputText, frameData } = c;
  let fidnum = 0;
  let fname = "?";
  let tippedToday = "0";
  let remainingAllocation = "0";
  let todayAllocation = "0";
  let totaltip = "0";
  let tipPercent = "0";
  let time = "0";

  // Default Image profile
  let avatarUrl = "https://i.postimg.cc/4Nj7s5fV/image-7.png";

  if (status !== 'initial') {
    let userFid = inputText || frameData.fid;
    fidnum = Number(userFid);
    try {
      const response = await axios.get(`http://api.bananabonanza.lol/frame/tipcheck?fid=${userFid}`);
      let rawdata = response.data;
      fname = rawdata.fname || fname;
      tipPercent = rawdata.tipPercent;
      remainingAllocation = rawdata.remainingAllocation || remainingAllocation;
      todayAllocation = rawdata.todaysAllocation || todayAllocation;
      totaltip = rawdata.totalTip || totaltip;
      avatarUrl = rawdata.avatar_url || avatarUrl;
      tippedToday = rawdata.tippedToday || tippedToday
      time = rawdata.time || time;
      tipPercent = tippedToday / todayAllocation
      if (tipPercent>1){
        tipPercent = 1
      }
      tipPercent = (tipPercent * 100).toFixed(2);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return c.res({
    image: (
      <div tw="items-center" style={{ width: "100%", height: "100%", background: "#01204E", display: "flex", justifyContent: "center", flexDirection: "column", color: "black" }}>
        <img tw="object-contain absolute bottom-0 right-0" style={{ width: "100%", height: "100%" }} src='https://i.postimg.cc/g0jg8SKm/background.png' />
        <div tw="flex pt-1 items-center absolute top-8">
          <img style={{ width: "90px", height: "90px" }} src='https://i.postimg.cc/KjqTNLtQ/coconutleft.png' />
          <h1 tw="font-bold text-[46px]">Coconut Stats</h1>
          <img style={{ width: "90px", height: "90px" }} src='https://i.postimg.cc/mgF9YPkN/coconutright.png' />
        </div>

        {status !== 'initial' && (
          <div tw="flex text-black flex-col px-4 pb-36">
            <div tw="flex pt-24 ">
              <img src={avatarUrl} tw="w-[90px] h-[90px] border border-white border-[5px] mt-2" />
              <div tw="flex flex-col justify-center pl-4">
                <div tw="text-[36px] flex">Name: {fname}</div>
                <div tw="text-[24px] flex ">FID: {fidnum}</div>
              </div>
              <img src='https://i.postimg.cc/nzTndvcX/coconut.png' tw="w-[140px] h-[140px] right-0 top-18 mt-2 absolute" />
            </div>
            <div tw="flex text-black  pt-4 ">
              <div tw="pr-4  flex flex-col">
                <div tw="text-[24px] flex">Today's Allocation</div>
                <div tw="text-[46px] flex pb-4">{todayAllocation}</div>
                <div tw="text-[24px] flex ">Total Tipped</div>
                <div tw="text-[46px] flex">{tippedToday}</div>



              </div>
              <div tw="px-4 flex flex-col">

                <div tw="text-[24px] flex ">Remaining Allocation</div>
                <div tw="text-[46px] flex pb-4">{remainingAllocation}</div>
                <div tw="text-[26px] flex">Total Earned</div>
                <div tw="text-[46px] flex ">{totaltip}</div>

              </div>
              <div tw="px-4 flex flex-col">
                <div tw="text-[30px] flex">tipped %</div>
                <div tw="text-[46px] flex">{tipPercent}%</div>

              </div>
            </div>
            <div tw="text-[24px] flex w-full text-center justify-center  pl-56 pt-7">{time}</div>
          </div>
        )}

        {status === 'initial' && (
          <div tw="flex flex-col pb-20">
            <p tw="font-bold text-[60px] text-center text-[40px] flex">Write Your FID To Check Your Status</p>
          </div>
        )}
      </div>
    ),
    intents: [
      <Button value="check">Check</Button>,
      <Button.Reset>Reset</Button.Reset>,
      <TextInput placeholder="Enter Fid Here" />,
      // { ...status === 'initial' && <Button.Reset>Reset</Button.Reset> },
      // { ...status === 'initial' && <TextInput placeholder="Enter Fid Here" /> },
    ],
  });
});
app.use('/*', serveStatic({ root: './public' }))
devtools(app, { serveStatic })

if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  })
  console.log('Server is running on port 3000')
}
