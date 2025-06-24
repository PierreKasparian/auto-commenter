import { onSuccessConnect } from "@/utils/unipile/queries";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  if (body.status == "CREATION_SUCCESS") {
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
