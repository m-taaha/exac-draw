"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createRoomHandler = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/room/create/",
        { slug },
        { withCredentials: true },
      );

      if (!response) return;

      const roomId = response.data.room.roomId;

      router.push(`/room/${roomId}`);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create Room");
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoomHandler = async () => {
    router.push(`/room/${joinSlug}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            exac<span className="text-indigo-500">.</span>draw
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Start or join a canvas</p>
        </div>

        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 space-y-6">
          {/* create room */}
          <div>
            <h2 className="text-white text-sm font-medium mb-3">
              Create a new room
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createRoomHandler();
              }}
              className="flex gap-2"
            >
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                type="text"
                placeholder="my-room-name"
                className="flex-1 bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2.5 transition-colors text-sm whitespace-nowrap"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </form>
          </div>

          <div className="border-t border-zinc-800" />

          {/* join room */}
          <div>
            <h2 className="text-white text-sm font-medium mb-3">
              Join existing room
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                joinRoomHandler();
              }}
              className="flex gap-2"
            >
              <input
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                type="text"
                placeholder="enter-room-name"
                className="flex-1 bg-[#1a1a1a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg px-4 py-2.5 transition-colors text-sm whitespace-nowrap"
              >
                {isLoading ? "Joining..." : "Join"}
              </button>
            </form>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
