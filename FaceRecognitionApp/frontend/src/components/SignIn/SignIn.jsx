import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Github, Chrome } from "lucide-react";
import { useState } from "react";

export default function SignInCard({ onRouteChange, loadUser }) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onEmailChange = (e) => {
    setUserEmail(e.target.value)
    if (errorMessage) setErrorMessage("")
  }

  const onPasswordChange = (e) => {
    setUserPassword(e.target.value)
    if (errorMessage) setErrorMessage("")
  }

  const onSubmitSignIn = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/signin", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      })
    })
    .then(response => response.json())
    .then(user => {
      if (user.id) {
        loadUser(user)
        onRouteChange("home")
      } else {
        setErrorMessage("Invalid Credentials")
      }
    })
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <Card className="w-full max-w-sm shadow-xl gradient-bg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-white">Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">

          <div className="relative">
            <Separator />
            <span className="absolute inset-0 -top-3 flex items-center justify-center">
              <span className="px-2 text-xs gradient-bg mt-3 text-white">OR</span>
            </span>
          </div>

          <form className="grid gap-5" onSubmit={onSubmitSignIn}>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative bg-white rounded-md">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-9 focus-visible:ring-0 focus-visible:border-cyan-400" 
                  autoComplete="email" 
                  onChange={onEmailChange} />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between text-white">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative bg-white rounded-md">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9 focus-visible:ring-0 focus-visible:border-pink-400" 
                  autoComplete="current-password" 
                  onChange={onPasswordChange} />
              </div>
            </div>

            <div className="flex items-center justify-between" />

            <Button 
                type="submit"
                value="Sign in"
                className="w-full hover:cursor-pointer"
                >
                    Sign in
            </Button>
              {errorMessage && (
                <p className="text-sm text-red-500 mt-2 text-center">{errorMessage}</p>
              )}
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center text-sm text-pink-100">
          Don&apos;t have an account?&nbsp;
          <button onClick={() => onRouteChange("register")} className="font-medium text-foreground underline-offset-4 hover:underline hover:cursor-pointer">Create one</button>
        </CardFooter>
      </Card>
    </div>
  );
}