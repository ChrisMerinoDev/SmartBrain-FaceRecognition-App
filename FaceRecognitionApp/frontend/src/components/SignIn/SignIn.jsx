import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/+$/, "") : "";

export default function SignInCard({ onRouteChange, loadUser }) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onEmailChange = (e) => {
    setUserEmail(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const onPasswordChange = (e) => {
    setUserPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const onSubmitSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Basic client-side validation
    const email = userEmail.trim().toLowerCase();
    const password = userPassword.trim();

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
    if (!API_BASE) {
      setErrorMessage("App is misconfigured: missing API base URL.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // Per-request AbortController + optional timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include" // only if you use cookies/sessions
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      if (!res.ok) {
        // Prefer server-provided JSON error if available
        const ct = res.headers.get("content-type") || "";
        let msg = "Invalid credentials";
        if (ct.includes("application/json")) {
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
        setErrorMessage("Invalid credentials");
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        setErrorMessage("Server took too long. Try again.");
      } else {
        const friendly =
          (err?.name === "TypeError" || /Failed to fetch/i.test(String(err?.message)))
            ? "Can’t reach the server. Please check your connection and try again."
            : err?.message || "Something went wrong. Please try again.";
        setErrorMessage(friendly);
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  // Optional: auto-clear error after a few seconds
  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(t);
  }, [errorMessage]);

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
                  onChange={onEmailChange}
                  disabled={loading}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 focus-visible:ring-0 focus-visible:border-pink-400"
                  autoComplete="current-password"
                  onChange={onPasswordChange}
                  disabled={loading}
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

            <div className="flex items-center justify-between" />

            <Button
              type="submit"
              value="Sign in"
              className="w-full hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {errorMessage && (
              <p className="text-sm text-red-500 mt-2 text-center" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center text-sm text-pink-100">
          Don&apos;t have an account?&nbsp;
          <button
            onClick={() => onRouteChange("register")}
            className="font-medium text-foreground underline-offset-4 hover:underline hover:cursor-pointer"
            disabled={loading}
          >
            Create one
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
