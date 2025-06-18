// "use client"
// import { createClient as createAdminClient } from "@supabase/supabase-js";

// import { getProviderId } from "@/utils/unipile/queries";
// import { getSystemPrompt } from "../api/generate-com/libs";


const page = async () => {
  // const id = getSystemPrompt("cocou")
  // console.log(id)
  // const adminAuthClient = createAdminClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
  //   {
  //     auth: {
  //       autoRefreshToken: false,
  //       persistSession: false,
  //     },
  //   }
  // ).auth.admin;  
  // const { data, error } = await adminAuthClient.getUserById("3a356d74-7f95-41a6-be51-36ae79319e5c")
  // console.log(error)
  // console.log(data.user?.email)
  return <div className=""></div>;
};

export default page
