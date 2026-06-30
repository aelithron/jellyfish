import { SignIn } from "./auth.module";

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
    </main>
  );
}
