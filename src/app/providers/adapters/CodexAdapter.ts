import {
  runLatencyBenchmark,
  getChainHeadBlock,
} from "@/app/api/benchmark/utils";

import {
  BenchmarkConfig,
  LatencyMetrics,
  DataFreshnessMetrics,
} from "../types";
import { BaseAdapter } from "./BaseAdapter";

export class CodexAdapter extends BaseAdapter {
  name = "codex" as const;

  async measureLatency(config: BenchmarkConfig): Promise<LatencyMetrics> {
    return runLatencyBenchmark(async () => {
      // Replace with actual Codex SDK call
      // API Limit/Premium tier needed

      //   return await codexSdk.queries.walletAggregateBackfillState({
      //     input: {
      //       walletAddress:
      //         config.address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      //     } as WalletAggregateBackfillInput,
      //   });
      return { data: "none" };
    }, config.samples);
  }

  async measureDataFreshness(
    config: BenchmarkConfig,
  ): Promise<DataFreshnessMetrics> {
    const chainHead = await getChainHeadBlock(config.chain.toString());
    return { chainHead, lastBlock: chainHead, blockLag: 0, timestampDelta: 0 };
  }
}
