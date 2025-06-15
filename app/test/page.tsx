"use client"


import { Button } from "@/components/ui/button";
import { toastStatusPop } from "@/utils/helpers";

const page = () => {
  // const router = useRouter()

  // useEffect(() => {
  //   const currentUrl = window.location.href;
  //   const newUrl = `${currentUrl}?status=Success&status_description=Subscription successful`;
  //   window.history.pushState({}, '', newUrl);
  //   router.replace(newUrl);
  // }, []);

  return <div className=""><br /><div className="h-screen"><br />
  comment posted</div><Button onClick={() => { toastStatusPop("Success", "Subscription successful") }}>Test</Button></div>;
};

export default page
