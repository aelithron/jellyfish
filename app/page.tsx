import SignIn from "./auth.module";
import notByAI from "@/public/not-by-ai.svg";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
        <div className="flex flex-col text-center items-center justify-center bg-sky-900 md:min-h-screen p-8 md:p-20 gap-2">
          <h1 className="text-2xl font-semibold">Jellyfish</h1>
          <p>&quot;Fish up&quot; media (music, movies, tv shows, etc) from a Jellyfin server!</p>
        </div>
        <div className="flex flex-col text-center items-center justify-center md:min-h-screen p-8 md:p-20 gap-2">
          <h1 className="text-xl">Sign in</h1>
          <p>(you need a Jellyfin server to use this!)</p>
          <SignIn />
        </div>
      </div>
      <footer className="flex gap-2 justify-between py-4 px-8 absolute bottom-0 w-full align-middle items-center">
        <a href="https://github.com/aelithron/jellyfish" target="_blank" className="hover:text-sky-500 underline">Source</a>
        <a href="https://notbyai.fyi" target="_blank"><Image src={notByAI} alt="Developed by a human, not by AI!" /></a>
      </footer>
    </main>
  );
}
