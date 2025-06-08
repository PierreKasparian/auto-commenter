import { createClient } from "@/utils/supabase/server";
import React from "react";
import Link from "next/link";

import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
const page = async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user?.id) {
    redirect("/login");
  }
  return (
    <div className="flex flex-col">
      <Navbar isDashboard={true} />
      <main className="flex-1">
        <section className="w-full">
          {/* <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            <Card
              className={`flex flex-col`}
            >
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>Perfect for testing our service</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">9€</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold text-center mb-4">250 credits</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Validity: forever</span>
                  </li>
                 
                </ul>
              </CardContent>
              <CardFooter>
               <BuyButton user_id={user.data.user?.id} credits={250}/>
              </CardFooter>
            </Card>

            <Card className={`flex flex-col`}>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-xl">Professional</CardTitle>
                <CardDescription>For growing your LinkedIn activity</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">27€</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold text-center mb-4">1000 credits</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Validity: forever</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Email support</span>
                  </li>
                
                </ul>
              </CardContent>
              <CardFooter>
                <BuyButton user_id={user.data.user?.id} credits={1000}/>
              </CardFooter>
            </Card>

            <Card
              className={`flex flex-col`}
            >
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>For large-scale communications</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">50€</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold text-center mb-4">2500 credits</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Validity: forever</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Advanced email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <BuyButton user_id={user.data.user?.id} credits={2500}/>
              </CardFooter>
            </Card>
          </div> */}
          <PricingSection isDashboard={true} />

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              Need a custom plan?{" "}
              <Link
                href="mailto:ia.school.app@gmail.com"
                className="text-primary font-medium hover:underline"
              >
                Contact us at ia.school.app@gmail.com
              </Link>
              <br />
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default page;
