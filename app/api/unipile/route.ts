export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { onSuccessConnect } from "./libs";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  if (body.status == "CREATION_SUCCESS") {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    await onSuccessConnect(body.name, body.account_id);
  } else {
    return NextResponse.json({
      status: "error",
      message: "Error connecting your account",
    });
  }
  return NextResponse.json({
    status: "success",
    message: "Your account has been successfully connected",
  });
}
