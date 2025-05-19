"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { login, signup } from "@/app/(auth)/login/action"
export default function LoginForm() {
  const [activeTab, setActiveTab] = useState("login")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    setIsSubmitted(true)
    await login(email, password)
    setIsSubmitted(false)
  }

  const handleSignup = async () => {
    setIsSubmitted(true)
    await signup(email, password)
    setIsSubmitted(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Log In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input 
                        id="email-login" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-login">Password</Label>

                      </div>
                      <Input 
                        id="password-login" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    {isSubmitted ? (
                      <Button className="w-full" disabled>
                        Logging in...
                      </Button>
                    ) : email === "" || password.length < 6 ? (
                      <Button className="w-full" disabled>
                        Log in <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={handleLogin}>
                        Log in <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </form>
                </TabsContent>
                <TabsContent value="signup">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input 
                        id="email-signup" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input 
                        id="password-signup" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    {isSubmitted ? (
                      <Button className="w-full" disabled>
                        Creating account...
                      </Button>
                    ) : email === "" || password.length < 6 ? (
                      <Button className="w-full" disabled>
                        Create account <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={handleSignup}>
                        Create account <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <Link href="/legal/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

    </div>
  )
}