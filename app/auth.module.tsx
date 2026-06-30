"use client";
import jellyfin from "@/utils/jellyfin";
import { useState } from "react";

export function SignIn() {
  const [stage, setStage] = useState<"server" | "credentials">("server");
  const [addr, setAddr] = useState<string>("");
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const server = jellyfin.discovery.findBestServer(await jellyfin.discovery.getRecommendedServerCandidates(addr));
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="server">Server</label>
      <input value={addr} onChange={(e) => setAddr(e.target.value)} id="server" className="border-2 border-black bg-slate-500 text-black p-1 rounded-xl" />
      <button type="submit" className="hover:text-sky-500">Continue</button>
    </form>
  );
}