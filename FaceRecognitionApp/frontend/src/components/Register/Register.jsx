import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, UserIcon, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/+$/, "") : "";

export default function RegisterCard({ onRouteChange, loadUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !normalizedEmail || !trimmedPassword) {
      setErrorMessage("Please enter name, email, and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          password: trimmedPassword,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        let msg = "Could not create account.";
        if (res.status === 409) msg = "That email is already registered.";
        else if (ct.includes("application/json")) {
          const data = await res.json().catch(() => null);
          if (data?.error) msg = data.error;
        } else {
          const text = await res.text().catch(() => "");
          if (text) msg = text;
        }
        throw new Error(msg);
      }

      const user = await res.json();
      if (user?.id) {
        loadUser(user);
        onRouteChange("home");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      const friendly =
        err?.name === "TypeError" || /Failed to fetch/i.test(String(err?.message))
          ? "Can’t reach the server. Please check your connection and try again."
          : err?.message || "Something went wrong. Please try again.";
      setErrorMessage(friendly);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  const hasError = Boolean(errorMessage);

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <Card className="w-full max-w-sm shadow-xl gradient-bg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-white">Register</CardTitle>
          <CardDescription className="text-white">
            create your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="relative">
            <Separator />
            <span className="absolute inset-0 -top-3 flex items-center justify-center">
              <span className="px-2 text-xs gradient-bg mt-3 text-white">OR</span>
            </span>
          </div>

          <form className="grid gap-5" onSubmit={onSubmitRegister} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <div className="relative bg-white rounded-md">
                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="your name here"
                  className="pl-9 focus-visible:ring-0 focus-visible:border-cyan-400"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  aria-invalid={hasError ? true : undefined}
                  aria-describedby={hasError ? "register-error" : undefined}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <div className="relative bg-white rounded-md">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9 focus-visible:ring-0 focus-visible:border-cyan-400"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  aria-invalid={hasError ? true : undefined}
                  aria-describedby={hasError ? "register-error" : undefined}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between text-white">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative bg-white rounded-md">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 focus-visible:ring-0 focus-visible:border-pink-400"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={hasError ? true : undefined}
                  aria-describedby={hasError ? "register-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white">Use a strong password</span>
            </div>

            <Button
              type="submit"
              className="w-full hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>

            {errorMessage && (
              <p
                id="register-error"
                className="text-sm text-red-500 mt-2 text-center"
                role="alert"
                aria-live="polite"
              >
                {errorMessage}
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center text-sm text-pink-100">
          Already have an account?&nbsp;
          <button
            onClick={() => onRouteChange("signin")}
            className="font-medium text-foreground underline-offset-4 hover:underline hover:cursor-pointer"
            disabled={loading}
          >
            Sign In
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
