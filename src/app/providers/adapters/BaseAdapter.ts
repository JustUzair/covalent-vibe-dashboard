import {
  ProviderAdapter,
  ProviderConfig,
  BenchmarkConfig,
  LatencyMetrics,
  DataFreshnessMetrics,
  CoverageMetrics,
  UnifiedBenchmarkResult,
} from "../types";

// Base configuration for providers
const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  covalent: {
    name: "covalent",
    displayName: "Covalent (GoldRush)",
    baseUrl: "https://api.covalenthq.com/v1",
    color: "#FF4C8B",
    enabled: true,
  },
  alchemy: {
    name: "alchemy",
    displayName: "Alchemy",
    baseUrl: "https://eth-mainnet.g.alchemy.com/v2",
    color: "#3636F9",
    enabled: true,
  },
  mobula: {
    name: "mobula",
    displayName: "Mobula",
    baseUrl: "https://api.mobula.io/api/1",
    color: "#56E39F",
    enabled: true,
  },
  codex: {
    name: "codex",
    displayName: "Codex",
    baseUrl: "https://api.codex.io",
    color: "#F7931A",
    enabled: true,
  },
};
abstract class BaseAdapter implements ProviderAdapter {
  abstract name: "covalent" | "alchemy" | "mobula" | "codex";

  get config(): ProviderConfig {
    return PROVIDER_CONFIGS[this.name];
  }

  abstract measureLatency(config: BenchmarkConfig): Promise<LatencyMetrics>;
  abstract measureDataFreshness(
    config: BenchmarkConfig,
  ): Promise<DataFreshnessMetrics>;

  async getCoverage(): Promise<CoverageMetrics> {
    return { chains: 0, chainsSupported: [], features: [] };
  }

  async runBenchmark(config: BenchmarkConfig): Promise<UnifiedBenchmarkResult> {
    const coverage = await this.getCoverage();
    const testEndpoint = config.endpoint;
    const provider = this.name;
    try {
      const [latency, freshness] = await Promise.all([
        this.measureLatency(config),
        this.measureDataFreshness(config),
      ]);

      return {
        provider,
        status: "success",
        testEndpoint,
        metrics: {
          latency,
          dataFreshness: freshness,
          coverage,
        },
      };
    } catch (error) {
      return {
        provider,
        status: "error",
        testEndpoint,
        error: error instanceof Error ? error.message : "Unknown error",
        metrics: {
          latency: {
            avg: 0,
            min: 0,
            max: 0,
            p50: 0,
            p95: 0,
            p99: 0,
            samples: 0,
          },
          dataFreshness: {
            blockLag: 0,
            timestampDelta: 0,
            lastBlock: 0,
            chainHead: 0,
          },
          coverage,
        },
      };
    }
  }
}

export { BaseAdapter, PROVIDER_CONFIGS };
