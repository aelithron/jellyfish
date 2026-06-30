"use client";
import jellyfin from "@/utils/jellyfin";
import { useEffect, useState } from "react";
import { Api } from "@jellyfin/sdk";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignIn() {
  const router = useRouter();
  const [jfAPI, setJFAPI] = useState<Api | null>(null);
  const [stage, setStage] = useState<"server" | "credentials">("server");
  const [addr, setAddr] = useState<string>("");
  const [publicUsers, setPublicUsers] = useState<UserDto[]>([]);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedInPrompt, setLoggedInPrompt] = useState<boolean>(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.localStorage.getItem("server") && window.localStorage.getItem("token")) setLoggedInPrompt(true)
  }, []);
  async function loadServer(e: React.SubmitEvent) {
    e.preventDefault();
    const server = jellyfin.discovery.findBestServer(await jellyfin.discovery.getRecommendedServerCandidates(addr));
    if (!server) {
      alert("This server couldn't be found, please check the server address.");
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
    let user;
    try {
      user = await getUserApi(jfAPI!).authenticateUserByName({ authenticateUserByName: { Username: username, Pw: password } });
    } catch {
      alert("There was an error signing you in, please check that your credentials are right and try again!");
      return;
    }
    if (!user || !user.data.AccessToken) {
      alert("There was an error signing you in, please check that your credentials are right and try again!");
      return;
    }
    window.localStorage.setItem("server", addr);
    window.localStorage.setItem("token", user.data.AccessToken);
    router.push("/fish");
  }
  if (loggedInPrompt) {
    return (
      <div className="flex flex-col gap-2 justify-center text-center">
        <h1 className="text-lg">You&apos;re already logged in!</h1>
        <div className="flex gap-2 text-center justify-center">
          <Link href={"/fish"} className="hover:text-sky-500 bg-sky-900 rounded-xl py-1 px-2">Fish!</Link>
          <button onClick={() => {
            window.localStorage.removeItem("server");
            window.localStorage.removeItem("token");
            setLoggedInPrompt(false);
          }} className="hover:text-sky-500 bg-red-500 rounded-xl py-1 px-2">Log Out</button>
        </div>
      </div>
    );
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