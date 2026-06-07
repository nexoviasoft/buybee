"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  background-color: transparent;
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const callBackURL = searchParams.get("callbackUrl");
  const canSubmit = useMemo(() => {
    const validEmail = /\S+@\S+\.\S+/.test(email);
    return validEmail && password.length >= 6 && !loading;
  }, [email, password, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      const errorMessage =
        result.error === "Invalid credentials"
          ? "Invalid email or password"
          : result.error || "Invalid email or password";
      toast.error(errorMessage);
      setLoading(false);
    } else {
      // Full page redirect ensures cookie is sent with request so middleware allows access
      const target = callBackURL || "/my-account/dashboard";
      window.location.href = target;
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <div className=" max-w-[500px]  mx-auto rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 text-center">
              <div className="inline-block mb-3">
                <span className="text-xs font-bold tracking-widest text-white px-4 py-2 rounded-full bg-primary">
                  Welcome
                </span>
              </div>
              <h2 className="text-3xl font-black text-primary">Login</h2>
              {callBackURL && (
                <p className="text-sm text-gray-600 mt-2">
                  Upon successful login, you will be redirected to: {callBackURL}
                </p>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiMail />
                  </span>
                  <Input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: "34px" }}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiLock />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: "34px", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="accent-primary" />
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-primary text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  className="bg-primary p-2.5 rounded text-white w-full hover:bg-primary/90 disabled:opacity-50 font-semibold"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-4">
                <p>Don't have an account?</p>
                <Link href="/register" className="text-primary font-semibold">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
