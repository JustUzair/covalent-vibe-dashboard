// Core provider types and interfaces

import { Chain } from "@covalenthq/client-sdk";

export type ProviderName = "covalent" | "alchemy" | "mobula" | "codex";

export interface LatencyMetrics {
  avg: number; // Average latency in ms
  min: number; // Minimum latency
  max: number; // Maximum latency
  p50: number; // 50th percentile
  p95: number; // 95th percentile
  p99: number; // 99th percentile
  samples: number; // Number of samples
}

export interface DataFreshnessMetrics {
  blockLag: number; // Blocks behind chain head
  timestampDelta: number; // Seconds behind
  lastBlock: number; // Latest block number from provider
  chainHead: number; // Actual chain head
}

export interface CoverageMetrics {
  chains: number; // Number of chains supported
  chainsSupported: string[]; // List of chain names
  protocols?: number; // Number of protocols indexed
  features?: string[]; // Supported features/endpoints
}

export interface BenchmarkMetrics {
  latency: LatencyMetrics;
  dataFreshness: DataFreshnessMetrics;
  coverage?: CoverageMetrics;
}

export interface UnifiedBenchmarkResult {
  provider: ProviderName;
  metrics: BenchmarkMetrics;
  status: "success" | "error" | "timeout" | "running";
  error?: string;
  testEndpoint: string; // Which endpoint was tested
}

// Configuration for each provider
export interface ProviderConfig {
  name: ProviderName;
  displayName: string;
  apiKey?: string;
  baseUrl: string;
  color: string; // For UI visualization
  enabled: boolean;
}

// Test configuration
export interface BenchmarkConfig {
  endpoint: string; // Which endpoint to test (e.g., 'getLatestBlock')
  chain: Chain; // Which chain to test on (e.g., 'ethereum')
  samples: number; // Number of test samples
  timeout: number; // Timeout in ms
  address?: string; // For balance/transaction tests
  timestamp: number; // For timestamp tests
}

// Provider adapter interface - all providers must implement this
export interface ProviderAdapter {
  name: ProviderName;
  config: ProviderConfig;

  // Core benchmark methods
  measureLatency(config: BenchmarkConfig): Promise<LatencyMetrics>;
  measureDataFreshness(config: BenchmarkConfig): Promise<DataFreshnessMetrics>;
  getCoverage(): Promise<CoverageMetrics>;

  // Run full benchmark
  runBenchmark(config: BenchmarkConfig): Promise<UnifiedBenchmarkResult>;
}
