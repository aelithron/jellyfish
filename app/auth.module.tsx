"use client";
import jellyfin from "@/utils/jellyfin";
import { useState } from "react";
import { Api } from "@jellyfin/sdk";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";

export function SignIn() {
  const [jfAPI, setJFAPI] = useState<Api | null>(null);
  const [stage, setStage] = useState<"server" | "credentials">("server");
  const [addr, setAddr] = useState<string>("");
  const [publicUsers, setPublicUsers] = useState<UserDto[]>([]);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  async function loadServer(e: React.SubmitEvent) {
    e.preventDefault();
    const server = jellyfin.discovery.findBestServer(await jellyfin.discovery.getRecommendedServerCandidates(addr));
    if (!server) {
      alert("This server couldn't be found! Please check your server address.");
      return;
    }
    const api = jellyfin.createApi(addr);
    setAddr(server.address);
    setJFAPI(api);
    setPublicUsers((await getUserApi(api!).getPublicUsers()).data);
    setStage("credentials");
  }
  async function authenticate(e: React.SubmitEvent) {
    e.preventDefault();
  }
  return (
    <div>
      {stage === "server" && <form onSubmit={loadServer} className="flex flex-col gap-2">
        <label htmlFor="server">Server</label>
        <input value={addr} onChange={(e) => setAddr(e.target.value)} id="server" className="border-2 border-black bg-slate-500 text-black p-1 rounded-xl" />
        <button type="submit" className="hover:text-sky-500">Continue</button>
      </form>}
      {stage === "credentials" && <form onSubmit={authenticate} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} id="username" className="border-2 border-black bg-slate-500 text-black p-1 rounded-xl" />
          <div className="flex gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {publicUsers.map((user) => (<button key={user.Id} type="button" onClick={() => setUsername(user.Name!)} className="bg-slate-700 rounded-xl py-1 px-2 flex gap-1 items-center text-center justify-center"><img src={`${addr}/Users/${user.Id}/Images/Primary`} alt="Jellyfin PFP" className="h-6 w-6" /> {user.Name}</button>))}
          </div>
        </div>
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="border-2 border-black bg-slate-500 text-black p-1 rounded-xl" />
        <button type="submit" className="hover:text-sky-500">Sign In</button>
      </form>}
    </div>
  );
}