
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
    await fetch("http://localhost:3000/api/cron", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });}
  return
}
