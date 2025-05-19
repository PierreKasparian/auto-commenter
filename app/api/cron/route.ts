import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("coucou");
  console.log(req.headers.get("Authorization"));
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const myHeaders = new Headers();
  myHeaders.append(
    "X-API-KEY",
    "1JEm4iqR.l2WOiZZ+iCFM00ttyLs4zNc8QCVXFgp6ZRkM/69L0OI="
  );
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("https://api12.unipile.com:14269/api/v1/accounts", requestOptions as RequestInit)
    .then((response) => 
        {console.log(response)
            return response.text()})
    .then((result) => console.log(result))
    .catch((error) => {
        console.log(error)
        return console.error(error)});
  console.log("fin");
  return NextResponse.json({ ok: true });
}
