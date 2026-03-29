"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";




export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev, 
           [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/v1/user/signup", form);
            if(!response) return;

            console.log("Response data:", response.data);
            console.log("Status code:", response.status);

            router.push("/signin")
            
        
        } catch (error: any) {
            setError(error.response?.data?.message || "Something went wrong")
        } finally {
          setIsLoading(false);
        }
    }



    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              exac<span className="text-indigo-500">.</span>draw
            </h1>
            <p className="text-zinc-500 text-sm mt-2">Create your account</p>
          </div>

          {/* contianer */}
          <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-zinc-400 text-sm block mb-1.5">
                  Name
                </label>
                <input
                  value={form.name}
                  name="name"
                  onChange={handleChange}
                  type="text"
                  placeholder="Name"
                  className="w-full bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5  text-white placeholder-zinc-600  focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm block mb-1.5">
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  placeholder="abcd@gmail.com"
                  className="w-full bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5  text-white placeholder-zinc-600  focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm block mb-1.5">
                  Password
                </label>
                <input
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5  text-white placeholder-zinc-600  focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border-red-400/20 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 transition-colors text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          <p className="text-center text-zinc-600 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    );
}