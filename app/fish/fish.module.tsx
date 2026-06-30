"use client";
import jellyfin from "@/utils/jellyfin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export default function Fish() {
  const router = useRouter();
  const [item, setItem] = useState<BaseItemDto | null>(null);
  async function fish() {
    const server = window.localStorage.getItem("server");
    const token = window.localStorage.getItem("token");
    if (!server || !token) {
      router.push("/");
      return;
    }
    const api = jellyfin.createApi(server, token);
    const allItems = (await getItemsApi(api).getItems({ includeItemTypes: ["Audio", "Movie"], mediaTypes: ["Audio", "Video"], recursive: true })).data.Items;
    setItem(allItems![Math.floor(Math.random() * allItems!.length)]);
  }
  return (
    <div className="flex flex-col p-8 gap-2">
      <button onClick={fish} className="bg-sky-900 p-2 rounded-xl">Fish!</button>
      {item && <div className="flex flex-col gap-2 justify-center text-center align-middle">
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img src={`${window.localStorage.getItem("server")}/Items/${item.Id}/Images/Primary`} alt="Item image (from Jellyfin)" className="w-1/4 h-1/4 mx-auto" />
        <h1>{item.Name}</h1>
      </div>}
    </div>
  )
}