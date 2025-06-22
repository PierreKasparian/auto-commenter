// "use client"
// import { createClient as createAdminClient } from "@supabase/supabase-js";

// import { generateComment } from "../api/generate-com/route";

// import { getProviderId } from "@/utils/unipile/queries";
// import { getSystemPrompt } from "../api/generate-com/libs";
import { getTimezoneOffsetInMinutes } from "@/utils/helpers";


const page = async () => {
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomTime = (timezone: string) => {
  const time = new Date();
  time.setHours(16);
  const offsetMinutes = Math.max(getTimezoneOffsetInMinutes(timezone), -8 * 60);

  const timeofTimezone = time.getTime() + offsetMinutes * 60 * 1000;
  const randomTime = getRandomInt(3, 24) * 5 * 60 * 1000;
  // const randomTime = 0
  return (timeofTimezone + randomTime).toString()//.slice(0, -5);
};
const a=generateRandomTime("Europe/Paris")
console.log(a)
console.log(new Date(Number(a)))
  return <div></div>
  ;
};

export default page
