import { LatencyMetrics } from "@/app/providers/types";

/**
 * Measures execution time of an async function
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Calculates percentile from sorted array
 */
function percentile(sortedArray: number[], p: number): number {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((p / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, index)];
}

/**
 * Runs multiple samples and calculates latency metrics
 */
export async function runLatencyBenchmark<T>(
  fn: () => Promise<T>,
  samples: number = 10,
  timeout: number = 30000,
): Promise<LatencyMetrics> {
  const durations: number[] = [];
  let successfulSamples = 0;

  for (let i = 0; i < samples; i++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout),
      );

      const { duration } = await Promise.race([
        measureExecutionTime(fn),
        timeoutPromise,
      ]);

      durations.push(duration);
      successfulSamples++;
    } catch (error) {
      console.error(`Sample ${i + 1} failed:`, error);
      // Continue with other samples
    }
  }

  if (durations.length === 0) {
    throw new Error("All benchmark samples failed");
  }

  // Sort for percentile calculations
  const sortedDurations = [...durations].sort((a, b) => a - b);

  return {
    avg: durations.reduce((a, b) => a + b, 0) / durations.length,
    min: Math.min(...durations),
    max: Math.max(...durations),
    p50: percentile(sortedDurations, 50),
    p95: percentile(sortedDurations, 95),
    p99: percentile(sortedDurations, 99),
    samples: successfulSamples,
  };
}

/**
 * Delays execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delayMs = baseDelay * Math.pow(2, attempt);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}

/**
 * Gets current chain head block number (using public RPC)
 */
export async function getChainHeadBlock(
  chain: string = "ethereum",
): Promise<number> {
  // Using public Ethereum RPC as reference
  const rpcUrls: Record<string, string> = {
    ethereum: "https://eth.llamarpc.com",
    polygon: "https://polygon.llamarpc.com",
    bsc: "https://binance.llamarpc.com",
  };

  const rpcUrl = rpcUrls[chain] || rpcUrls.ethereum;

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });

    const data = await response.json();
    return parseInt(data.result, 16);
  } catch (error) {
    console.error("Failed to get chain head:", error);
    throw new Error("Could not retrieve chain head block");
  }
}

/**
 * Formats milliseconds to readable string
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Formats large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
