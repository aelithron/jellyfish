"use client";
import jellyfin from "@/utils/jellyfin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export default function Fish() {
  const router = useRouter();
  const [item, setItem] = useState<BaseItemDto | null>(null);
  const [isFishing, setIsFishing] = useState<boolean>(false);
  async function fish() {
    if (isFishing) return;
    setIsFishing(true);
    const server = window.localStorage.getItem("server");
    const token = window.localStorage.getItem("token");
    if (!server || !token) {
      router.push("/");
      return;
    }
    const api = jellyfin.createApi(server, token);
    const allItems = (await getItemsApi(api).getItems({ includeItemTypes: ["Audio", "Movie"], mediaTypes: ["Audio", "Video"], recursive: true })).data.Items;
    setItem(allItems![Math.floor(Math.random() * allItems!.length)]);
    setTimeout(() => setIsFishing(false), 3000);
  }
  return (
    <div className="flex flex-col p-8 gap-2">
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <button onClick={fish} disabled={isFishing} className={`${!isFishing ? "bg-sky-900" : "bg-sky-950 text-slate-400"} p-2 rounded-xl`}>{isFishing ? "Fishing..." : "Fish!"}</button>
      </div>
      {(item && !isFishing) && <div className="flex flex-col justify-end w-full">
        <div className="bg-violet-700 rounded-md p-2 gap-2 text-center justify-center items-center w-fit ml-auto">
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img src={`${window.localStorage.getItem("server")}/Items/${item.Id}/Images/Primary`} alt="Item image (from Jellyfin)" className="w-48 h-auto" />
          <h1>{item.Name}</h1>
        </div>
      </div>}
    </div>
  )
}