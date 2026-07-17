import Mux from "@mux/mux-node";

let muxClient: Mux | undefined;

export function getMuxClient() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET are required.");
  }

  muxClient ??= new Mux({ tokenId, tokenSecret });
  return muxClient;
}
