
export default async function Home() {
  if(process.env.NEXT_ENV === "development"){
    // await fetch("http://localhost:3000/api/kw", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.CRON_SECRET}`,
    //   },
    //   body: JSON.stringify({
    //     account_id: "z5SmJeA9SEW1-L2fXSSqrg"
    //   }),
    // });}
    await fetch("http://localhost:3000/api/kw", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TRIG_TASK_KEY}`,
      },
      body: JSON.stringify({
        account_id: "HYRdNXu7QpK1eBVPxT2Qlg"
      }),
    });}else{
      await fetch("https://auto-commenter.vercel.app/api/kw", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TRIG_TASK_KEY}`,
        },
        body: JSON.stringify({
          account_id: "HYRdNXu7QpK1eBVPxT2Qlg"
        }),
      });
    }
  return
}
