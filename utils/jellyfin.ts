import { Jellyfin } from "@jellyfin/sdk";
const jellyfin = new Jellyfin({ clientInfo: { name: "Jellyfish", version: "1.0.0" }, deviceInfo: { name: "Jellyfish Website", id: "jellyfish-web" } });
export default jellyfin;