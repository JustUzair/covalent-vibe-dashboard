import { Codex } from "@codex-data/sdk";
import { MobulaClient } from "@mobula_labs/sdk";
import { Alchemy, Network } from "alchemy-sdk";
import { GoldRushClient } from "@covalenthq/client-sdk";

export const codexSdk = new Codex(process.env.NEXT_CODEX_API_KEY!);
export const mobulaSdk = new MobulaClient({
  apiKey: process.env.NEXT_MOBULA_API_KEY!,
});
export const alchemySdk = new Alchemy({
  apiKey: process.env.NEXT_ALCHEMY_API_KEY!,
  network: Network.ETH_MAINNET,
  connectionInfoOverrides: {
    skipFetchSetup: true,
  },
});
export const covalentSdk = new GoldRushClient(
  process.env.NEXT_COVALENT_GOLDRUSH_API_KEY!,
);
