
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// import { sendMail } from "@/utils/helpers";
// import nodemailer from "nodemailer";
// import { createClient } from "@/utils/supabase/server";
// import { postComment } from "@/utils/unipile/queries";
const page = async () => {
//   sendMail("ia.school.app@gmail.com", "Auto commenter account problem", `Hey, 
// There was a problem accessing to your Linkedin account to generate new comments. Please connect to https://auto-commenter.vercel.app/dashboard to fix the issue.

// Best regards,
// Pierre
// `);
//  co     console.log(upsertError)
// const supabase = await createClient();

// const { data, error } = await supabase
//           .from("unipile_id")
//           .select("unipile_id,end_trial,user_timezone(timezone,created_at)")
//           .eq("unipile_id", "xH9knahXS82M36FODsMr7Q")
//           .single();
// // create reusable transporter object using the default SMTP transport
// console.log(data)
// console.log(error)
// console.log(new Date(data?.end_trial))
// console.log(new Date())
// if (new Date(data?.end_trial) < new Date()) {
//         console.log("Trial ended for account", data?.unipile_id);
//       }
// const { data: data_select_credits, error: error_select_credits } =
// await supabase
//   .from("unipile_id")
//   .update({ end_trial: null })
//   .eq("user_id", "69ee9830-91ca-4a10-9495-4eefa612ba86")
//   .select();
// console.log(data_select_credits)
// console.log(error_select_credits)
// const { data: post_time, error: error_time } = await supabase.from('comment_proposal').select('*').not("post_time", "is", null);

  // console.log(JSON.stringify(post_time))
  // console.log(error_time)
  // await postComment("urn:li:activity:7338441119095050240","très intéressant","xH9knahXS82M36FODsMr7Q")
  return <div>comment posted</div>;
};

export default page;
