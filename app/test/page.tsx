// "use client"
// import { createClient as createAdminClient } from "@supabase/supabase-js";

// import { generateComment } from "../api/generate-com/route";

// import { getProviderId } from "@/utils/unipile/queries";
// import { getSystemPrompt } from "../api/generate-com/libs";
// import { getTimezoneOffsetInMinutes } from "@/utils/helpers";
import { getUnipileConnectUrl } from "@/utils/unipile/queries";
import { createClient } from "@/utils/supabase/server";


const page = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const a=await  getUnipileConnectUrl(process.env.NEXT_ENV==="development"?"http://localhost:3000/dashboard":"https://auto-commenter.vercel.app/dashboard",process.env.NEXT_ENV==="development"?"http://localhost:3000/dashboard":"https://auto-commenter.vercel.app/dashboard",true,user?.user?.id);
  //getUnipileConnectUrl("http://localhost:3000/dashboard","http://localhost:3000/dashboard",true)
  console.log(a)
  return <>
  <a href={a}>Connect</a>
  </>
}
export default page
