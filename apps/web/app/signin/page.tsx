"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        "email": "",
        "password": ""
    })

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
             [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setError("")
        try{
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/user/signin`,
              form,
              { withCredentials: true },
            );
            if(!response) return;

               console.log("Response data:", response.data);
               console.log("Status code:", response.status);

               router.push("/dashboard")

        } catch (error: any) {
            setError(error.response?.data?.message || "Something went wrong!.")
        } finally {
            setIsLoading(false)
        }
    }


    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              exac<span className="text-indigo-500">.</span>draw
            </h1>
            <p className="text-zinc-500 text-sm mt-2">Welcome back</p>
          </div>

          {/* form  */}
          <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8">
            <form
             onSubmit={handleSubmit}
             className="space-y-5">
              <div>
                <label className="text-zinc-400 text-sm block mb-1.5">
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={handleInput}
                  name="email"
                  type="email"
                  placeholder="abcd@gmail.com"
                  className="w-full bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 foucs:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm block mb-1.5">
                  Password
                </label>
                <input
                  value={form.password}
                  onChange={handleInput}
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 foucs:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              {/* error message */}
              {
                error && (
                    <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                        {error}
                    </p>
                )
              }

              <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 transition-colors text-sm"
              disabled={isLoading}
              >
                {isLoading? "Signing in...": "Sign in"}
              </button>
            </form>
          </div>

          <p className="text-center text-zinc-600 text-sm mt-6">
            Don't have an account? {" "}
            <a href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign up</a>
          </p>
        </div>
      </div>
    );
} 