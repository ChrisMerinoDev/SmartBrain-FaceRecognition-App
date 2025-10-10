import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, UserIcon } from "lucide-react";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RegisterCard({ onRouteChange, loadUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onNameChange = (e) => {
    setName(e.target.value)
  }

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onSubmitRegister = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      })
    })
    .then(response => response.json())
    .then(user => {
      if (user) {
        loadUser(user)
        console.log(user)
        onRouteChange("home")
      }
    })
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <Card className="w-full max-w-sm shadow-xl gradient-bg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-white">Register</CardTitle>
          <CardDescription className="text-white">create your account</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">

          <div className="relative">
            <Separator />
            <span className="absolute inset-0 -top-3 flex items-center justify-center">
              <span className="px-2 text-xs gradient-bg mt-3 text-white">OR</span>
            </span>
          </div>

          <form className="grid gap-5" onSubmit={onSubmitRegister}>
          <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <div className="relative bg-white rounded-md">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="your name here" 
                  className="pl-9 focus-visible:ring-0 focus-visible:border-cyan-400" 
                  autoComplete="name"
                  onChange={onNameChange}
                />
              </div>
            </div>

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
                  onChange={onEmailChange}  
                />
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
                  onChange={onPasswordChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white">Use a strong password</span>
            </div>

            <Button 
                type="submit" 
                className="w-full hover:cursor-pointer"
                >
                    Register
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center text-sm text-pink-100">
          Already have an account?&nbsp;
          <button onClick={() => onRouteChange("signin")} className="font-medium text-foreground underline-offset-4 hover:underline hover:cursor-pointer">Sign In</button>
        </CardFooter>
      </Card>
    </div>
  );
}
