import React from "react";
// import { createClient } from "@/utils/supabase/server";
// 
const page = async () => {
  // const supabase = await createClient();
  // const { data,error: upsertError } = await supabase
  //       .from("comment_time")
  //       .upsert(
  //         [
  //           {
  //             unipile_id: "XSa0OZUISp-XvvZCmdCpog",
  //             comment_time: "17489627",
  //             created_at: new Date().toISOString(),
  //           },
  //         ],
  //         {
  //           onConflict: "unipile_id",
  //           ignoreDuplicates: false
  //         }
  //       ).select();
  //       console.log(upsertError)
  return <div>{/*JSON.stringify(data)*/}</div>;
};

export default page;
