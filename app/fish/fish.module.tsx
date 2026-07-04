"use client";
import jellyfin from "@/utils/jellyfin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import noImage from "@/public/no_image.webp";

export default function Fish() {
  const router = useRouter();
  const [item, setItem] = useState<BaseItemDto | null>(null);
  const [isFishing, setIsFishing] = useState<boolean>(false);

  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [movieOn, setMovieOn] = useState<boolean>(true);
  const [showOn, setShowOn] = useState<boolean>(true);
  const [bookOn, setBookOn] = useState<boolean>(false);
  const [playlistOn, setPlaylistOn] = useState<boolean>(false);
  async function fish() {
    if (isFishing) return;
    setIsFishing(true);
    const server = window.localStorage.getItem("server");
    const token = window.localStorage.getItem("token");
    if (!server || !token) {
      router.push("/");
      return;
    }
    const types: BaseItemKind[] = [];
    if (musicOn) types.push("Audio");
    if (movieOn) types.push("Movie");
    if (showOn) types.push("Series");
    if (bookOn) types.push("Book");
    if (playlistOn) types.push("Playlist");
    if (types.length === 0) {
      setIsFishing(false);
      alert("There's nothing to catch! Enable some categories in the media settings :3");
      return;
    }
    const api = jellyfin.createApi(server, token);
    const allItems = (await getItemsApi(api).getItems({ includeItemTypes: types, recursive: true })).data.Items;
    if (!allItems || allItems.length < 1) {
      setIsFishing(false);
      alert("There's nothing to catch! Make sure your Jellyfin server has media in the categories you have selected, and maybe enable more categories in the media settings :3c");
      return;
    }
    setItem(allItems![Math.floor(Math.random() * allItems!.length)]);
    setTimeout(() => setIsFishing(false), 3000);
  }
  return (
    <div className="flex flex-col p-8 gap-2">
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <button onClick={fish} disabled={isFishing} className={`${!isFishing ? "bg-sky-900" : "bg-sky-950 text-slate-400"} p-2 rounded-xl text-lg`}>{isFishing ? "Fishing..." : "Fish!"}</button>
      </div>
      <div className={(item && !isFishing) ? "flex gap-2 justify-between" : ""}>
        <div className="flex flex-col w-full">
          <div className="bg-violet-700 rounded-md p-2 gap-2 w-fit mr-auto">
            <h2 className="text-xl font-semibold">Media</h2>
            <div className="flex gap-2 align-middle items-center">
              <input type="checkbox" checked={musicOn} onChange={(e) => setMusicOn(e.target.checked)} />
              <p>Music</p>
            </div>
            <div className="flex gap-2 align-middle items-center">
              <input type="checkbox" checked={movieOn} onChange={(e) => setMovieOn(e.target.checked)} />
              <p>Movies</p>
            </div>
            <div className="flex gap-2 align-middle items-center">
              <input type="checkbox" checked={showOn} onChange={(e) => setShowOn(e.target.checked)} />
              <p>Shows</p>
            </div>
            <div className="flex gap-2 align-middle items-center">
              <input type="checkbox" checked={bookOn} onChange={(e) => setBookOn(e.target.checked)} />
              <p>Books</p>
            </div>
            <div className="flex gap-2 align-middle items-center">
              <input type="checkbox" checked={playlistOn} onChange={(e) => setPlaylistOn(e.target.checked)} />
              <p>Playlists</p>
            </div>
          </div>
        </div>
        {(item && !isFishing) && <div className="flex flex-col justify-end w-full">
          <div className="bg-violet-700 rounded-md p-2 text-center justify-center items-center w-fit ml-auto">
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src={`${window.localStorage.getItem("server")}/Items/${item.Id}/Images/Primary`} alt="Item image (from Jellyfin)" className="w-48 h-auto rounded-md mx-auto" onError={(e) => { e.currentTarget.src = noImage.src }} />
            <h1 className="mt-2">{getIcon(item.Type!)} {item.Name}</h1>
            <a href={`${window.localStorage.getItem("server")}/web/index.html#!/details?id=${item.Id}`} target="_blank" className="bg-sky-600 p-1 rounded-md mt-2">Open</a>
          </div>
        </div>}
      </div>
    </div>
  )
}
function getIcon(type: BaseItemKind): string {
  switch (type) {
    case "Audio":
      return "🎵";
    case "Movie":
      return "🎬";
    case "Series":
      return "📺";
    case "Book":
      return "📕";
    case "Playlist":
      return "🎶";
    default:
      return "";
  }
}