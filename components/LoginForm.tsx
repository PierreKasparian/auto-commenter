"use client";

import Link from "next/link";
import {  useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, signup } from "@/app/(auth)/login/action";
import { redirectToPath } from "@/utils/supabase/server";
import { getErrorRedirect } from "@/utils/helpers";
import { Navbar } from "./navbar";
export default function LoginForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("");

  const handleLogin = async () => {
    setIsSubmitted(true);
    const { error } = await login(email, password);
    setIsSubmitted(false);
    if (error) {
      redirectToPath(getErrorRedirect("/login", "Erreur", error));
    }
  };
  
  const handleSignup = async (
    email: string,
    password: string,
    timezone: string
  ) => {
    setIsSubmitted(true);
    const { error } = await signup(email, password, timezone);
    setIsSubmitted(false);
    if (error) {
      redirectToPath(getErrorRedirect("/login", "Erreur", error));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b bg-white to-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center text-gray-900">
                Welcome to CommentPro
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Create your account to start automating your LinkedIn
                interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="login"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 gap-2">
                  <TabsTrigger
                    value="login"
                    className="bg-white hover:bg-gray-50"
                  >
                    Log In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="bg-white hover:bg-gray-50"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email-login"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email address
                      </Label>
                      <Input
                        id="email-login"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="password-login"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <Input
                        id="password-login"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    {isSubmitted ? (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                        disabled
                      >
                        Logging in...
                      </Button>
                    ) : email === "" || password.length < 6 ? (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                        disabled
                      >
                        Log in <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                        onClick={handleLogin}
                      >
                        Log in <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    <div className="text-center text-sm text-gray-500">
                      <Link
                        href="/forgot-password"
                        className="text-teal-600 hover:text-teal-700"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="signup">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email-signup"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email address
                      </Label>
                      <Input
                        id="email-signup"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="password-signup"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <Input
                        id="password-signup"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="timezone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Timezone
                      </Label>
                      <Select
                        value={timezone}
                        onValueChange={setTimezone}
                        required
                      >
                        <SelectTrigger className="w-full border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Select your timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/London">UTC</SelectItem>
                          <SelectItem value="Europe/Paris">
                            UTC+1 (Paris, Berlin)
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            UTC-5 (New York)
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            UTC-8 (San Francisco)
                          </SelectItem>
                          <SelectItem value="Asia/Shanghai">
                            UTC+8 (Beijing)
                          </SelectItem>
                          <SelectItem value="Asia/Tokyo">
                            UTC+9 (Tokyo)
                          </SelectItem>
                          <SelectItem value="Australia/Sydney">
                            UTC+10 (Sydney)
                          </SelectItem>
                          <SelectItem value="Australia/Melbourne">
                            UTC+11 (Melbourne)
                          </SelectItem>
                          <SelectItem value="America/Sao_Paulo">
                            UTC-3 (São Paulo)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isSubmitted ? (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                        disabled
                      >
                        Creating account...
                      </Button>
                    ) : email === "" ||
                      password.length < 6 ||
                      timezone === "" ? (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                        disabled
                      >
                        Create account <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                        onClick={() => handleSignup(email, password, timezone)}
                      >
                        Create account <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    <div className="text-center text-sm text-gray-500">
                      <p className="mt-2">
                        By signing up, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="text-teal-600 hover:text-teal-700"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-teal-600 hover:text-teal-700"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
