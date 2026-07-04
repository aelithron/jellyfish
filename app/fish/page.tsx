import { Metadata } from "next";
import Fish from "./fish.module";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fish!" };
export default function Page() {
  return (
    <main className={`flex flex-col min-h-screen bg-cover bg-center bg-[url(/water.webp)]`}>
      <Fish />
    </main>
  );
}