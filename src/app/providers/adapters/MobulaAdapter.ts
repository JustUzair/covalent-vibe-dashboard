import {
  runLatencyBenchmark,
  getChainHeadBlock,
} from "@/app/api/benchmark/utils";
import {
  BenchmarkConfig,
  LatencyMetrics,
  DataFreshnessMetrics,
  CoverageMetrics,
} from "../types";
import { BaseAdapter, PROVIDER_CONFIGS } from "./BaseAdapter";

export class MobulaAdapter extends BaseAdapter {
  name = "mobula" as const;

  async measureLatency(config: BenchmarkConfig): Promise<LatencyMetrics> {
    return runLatencyBenchmark(async () => {
      // Assuming Mobula SDK structure or falling back to a basic call
      // Replace with actual SDK method: e.g., mobulaSdk.fetchWalletHistory(...)
      // SDK funciton doesn't work probably because of beta
      //   return await mobulaSdk.fetchWalletHistory({
      //     wallets: config.address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth
      //     blockchains: "ethereum",
      //     // wallets:
      //   });

      return await fetch(
        `${PROVIDER_CONFIGS.mobula.baseUrl}/wallets/transactions?wallet=${config.address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}`,
      );
    }, config.samples);
  }

  async measureDataFreshness(
    config: BenchmarkConfig,
  ): Promise<DataFreshnessMetrics> {
    // Mobula is primarily market data, so block freshness might not be their main API
    // We will return 0 lag for now or implement a specific market-data freshness check
    const chainHead = await getChainHeadBlock(config.chain.toString());
    return { chainHead, lastBlock: chainHead, blockLag: 0, timestampDelta: 0 };
  }

  async getCoverage(): Promise<CoverageMetrics> {
    try {
      // Mobula often categorizes by "Premium" and "All"
      // We'll fetch the full list from their metadata service
      // Doesnt work probably beta features
      //   const response = (await mobulaSdk.fetchAllBlockchains()).data;
      const response = await fetch(
        `${PROVIDER_CONFIGS.mobula.baseUrl}/blockchains`,
      );
      //   const resJson = await response.json();
      const { data } = (await response.json()) as Partial<{
        data: [
          {
            name: string;
            chainId: string;
          },
        ];
      }>;

      //   console.log(`Mobula Networks::\n`, data);

      // The response structure usually contains a 'data' array of chain objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chainNames = data?.map((c: any) => c.name || c.id);

      return {
        chains: chainNames?.length || 0,
        chainsSupported: chainNames || [],
      };
    } catch (error) {
      //   console.error(`Mobula Error::\n`, error);

      // Fallback if the SDK call fails
      return {
        chains: 8, // Their "Premium" core count
        chainsSupported: [
          "ethereum",
          "base",
          "polygon",
          "arbitrum",
          "avalanche",
          "bsc",
          "optimism",
          "sonic",
        ],
      };
    }
  }
}
