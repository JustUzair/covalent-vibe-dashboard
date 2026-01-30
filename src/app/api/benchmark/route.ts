// Core benchmarking engine with utility functions

import { NextResponse } from "next/server";
import { BenchmarkConfig } from "../../providers/types";
import { adapters } from "../../providers/adapters";
import type { BaseAdapter } from "../../providers/adapters";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, chain, samples, address } = body;

    const config: BenchmarkConfig = {
      endpoint: endpoint || "getBalances",
      chain: chain || "ethereum",
      samples: samples || 5,
      timeout: 10000,
      address: address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Vitalik.eth
      timestamp: Date.now(),
    };

    // Run benchmarks in parallel for all providers
    const results = await Promise.all(
      Object.values(adapters).map((adapter: unknown) =>
        (adapter as BaseAdapter).runBenchmark(config),
      ),
    );

    return NextResponse.json({
      success: true,
      config,
      results,
    });
  } catch (error) {
    console.error("Benchmark failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
