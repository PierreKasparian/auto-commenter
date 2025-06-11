
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// import { sendMail } from "@/utils/helpers";
// import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";
import { postComment } from "@/utils/unipile/queries";
const page = async () => {
//   sendMail("ia.school.app@gmail.com", "Auto commenter account problem", `Hey, 
// There was a problem accessing to your Linkedin account to generate new comments. Please connect to https://auto-commenter.vercel.app/dashboard to fix the issue.

// Best regards,
// Pierre
// `);
//  co     console.log(upsertError)

// create reusable transporter object using the default SMTP transport
const supabase = await createClient();

// const { data: post_time, error: error_time } = await supabase.from('comment_proposal').select('*').not("post_time", "is", null);

  // console.log(JSON.stringify(post_time))
  // console.log(error_time)
  // await postComment("urn:li:activity:7338441119095050240","très intéressant","xH9knahXS82M36FODsMr7Q")
  return <div>comment posted</div>;
};

export default page;
