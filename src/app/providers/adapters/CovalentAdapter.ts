import {
  runLatencyBenchmark,
  getChainHeadBlock,
} from "@/app/api/benchmark/utils";
import { ChainName } from "@covalenthq/client-sdk";
import { covalentSdk } from "../sdk";
import {
  BenchmarkConfig,
  LatencyMetrics,
  DataFreshnessMetrics,
  CoverageMetrics,
} from "../types";
import { BaseAdapter } from "./BaseAdapter";

export class CovalentAdapter extends BaseAdapter {
  name = "covalent" as const;

  async measureLatency(config: BenchmarkConfig): Promise<LatencyMetrics> {
    return runLatencyBenchmark(async () => {
      // Benchmark: Get Token Balances (Heavy Read)
      if (config.endpoint === "getBalances") {
        return await covalentSdk.BalanceService.getTokenBalancesForWalletAddress(
          config.chain,
          config.address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        );
      }
      // Benchmark: Get Block (Light Read)
      return await covalentSdk.BaseService.getBlock(config.chain, "latest");
    }, config.samples);
  }

  async measureDataFreshness(
    config: BenchmarkConfig,
  ): Promise<DataFreshnessMetrics> {
    try {
      // Get latest block from Covalent - use the correct method
      const response = await covalentSdk.BaseService.getBlock(
        "eth-mainnet",
        "latest",
      );

      if (response.error || !response.data) {
        throw new Error("Covalent block fetch failed");
      }

      const covalentBlock = response.data.items?.[0]?.height || 0;
      const covalentTimestamp = new Date(
        response.data.items?.[0]?.signed_at || Date.now(),
      ).getTime();

      // Get actual chain head
      const chainHead = await getChainHeadBlock(config.chain?.toString());

      return {
        chainHead,
        lastBlock: covalentBlock,
        blockLag: chainHead - covalentBlock,
        timestampDelta: Math.floor((Date.now() - covalentTimestamp) / 1000),
      };
    } catch (error) {
      console.error("Covalent freshness failed:", error);
      const chainHead = await getChainHeadBlock(config.chain?.toString());
      return {
        chainHead,
        lastBlock: 0,
        blockLag: chainHead, // Show full lag if failed
        timestampDelta: 0,
      };
    }
  }
  async getCoverage(): Promise<CoverageMetrics> {
    // Covalent exports ChainName as an object/enum
    const allChains = Object.values(ChainName);

    // console.log("Covalent::Coverage", allChains);

    return {
      chains: allChains.length,
      chainsSupported: allChains,
    };
  }
}
