import {
  runLatencyBenchmark,
  getChainHeadBlock,
} from "@/app/api/benchmark/utils";
import { Network } from "alchemy-sdk";
import { alchemySdk } from "../sdk";
import {
  BenchmarkConfig,
  LatencyMetrics,
  DataFreshnessMetrics,
  CoverageMetrics,
} from "../types";
import { BaseAdapter } from "./BaseAdapter";

export class AlchemyAdapter extends BaseAdapter {
  name = "alchemy" as const;

  async measureLatency(config: BenchmarkConfig): Promise<LatencyMetrics> {
    return runLatencyBenchmark(async () => {
      if (config.endpoint === "getBalances") {
        return await alchemySdk.core.getTokenBalances(
          config.address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        );
      }
      return await alchemySdk.core.getBlockNumber();
    }, config.samples);
  }

  async measureDataFreshness(
    config: BenchmarkConfig,
  ): Promise<DataFreshnessMetrics> {
    const chainHead = await getChainHeadBlock(config.chain.toString());
    const lastBlock = await alchemySdk.core.getBlockNumber();

    return {
      chainHead,
      lastBlock,
      blockLag: Math.max(0, chainHead - lastBlock),
      timestampDelta: 0,
    };
  }

  async getCoverage(): Promise<CoverageMetrics> {
    // Get all enum values (the strings used in config, e.g., "eth-mainnet")
    const allNetworkValues = Object.values(Network);

    // console.log(allNetworkValues);
    // console.log("Alchemy::Coverage \n", allNetworkValues);
    return {
      chains: allNetworkValues.length,
      chainsSupported: allNetworkValues,
    };
  }
}
