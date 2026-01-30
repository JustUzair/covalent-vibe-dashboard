import { BaseAdapter } from "./BaseAdapter";
import { AlchemyAdapter } from "./AlchemyAdapter";
import { CodexAdapter } from "./CodexAdapter";
import { CovalentAdapter } from "./CovalentAdapter";
import { MobulaAdapter } from "./MobulaAdapter";
import { ProviderAdapter } from "../types";

// Placeholder for Mobula (assuming generic fetch if SDK types aren't fully exposed yet)

export const adapters = {
  covalent: new CovalentAdapter(),
  alchemy: new AlchemyAdapter(),
  mobula: new MobulaAdapter(),
  //   codex: new CodexAdapter(), // Has some rate limiting issues/ premium sub required
};

export type { ProviderAdapter, BaseAdapter };
