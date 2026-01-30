import { UnifiedBenchmarkResult } from "@/app/providers/types";
import { motion, AnimatePresence } from "framer-motion";

import { Zap, Clock, Network } from "lucide-react";
import { useState } from "react";
import { MetricCard, MetricRow } from "../MetricCard";

export const DetailedMetrics = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(
    results[0]?.provider || null,
  );

  const selectedResult = results.find(r => r.provider === selectedProvider);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-white/20"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Detailed Metrics
      </h2>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {results.map(result => (
          <button
            key={result.provider}
            onClick={() => setSelectedProvider(result.provider)}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedProvider === result.provider
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {result.provider.charAt(0).toUpperCase() + result.provider.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedResult && (
          <motion.div
            key={selectedProvider}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Latency Statistics"
                icon={<Zap className="w-5 h-5 text-amber-600" />}
                color="yellow"
              >
                <div className="space-y-2">
                  <MetricRow
                    label="Average"
                    value={`${selectedResult.metrics.latency.avg.toFixed(2)}ms`}
                  />
                  <MetricRow
                    label="Minimum"
                    value={`${selectedResult.metrics.latency.min.toFixed(2)}ms`}
                  />
                  <MetricRow
                    label="Maximum"
                    value={`${selectedResult.metrics.latency.max.toFixed(2)}ms`}
                  />
                  <MetricRow
                    label="P50"
                    value={`${selectedResult.metrics.latency.p50.toFixed(2)}ms`}
                  />
                  <MetricRow
                    label="P95"
                    value={`${selectedResult.metrics.latency.p95.toFixed(2)}ms`}
                  />
                  <MetricRow
                    label="P99"
                    value={`${selectedResult.metrics.latency.p99.toFixed(2)}ms`}
                  />
                </div>
              </MetricCard>

              <MetricCard
                title="Data Freshness"
                icon={<Clock className="w-5 h-5" />}
                color="blue"
              >
                <div className="space-y-2">
                  <MetricRow
                    label="Block Lag"
                    value={`~${selectedResult.metrics.dataFreshness.blockLag.toString()} Blocks`}
                  />
                  <MetricRow
                    label="Time Delta"
                    value={`~${selectedResult.metrics.dataFreshness.timestampDelta}s`}
                  />
                  <MetricRow
                    label="Public Chain Head"
                    value={selectedResult.metrics.dataFreshness.chainHead.toLocaleString()}
                  />
                  <MetricRow
                    label="Last Block"
                    value={selectedResult.metrics.dataFreshness.lastBlock.toLocaleString()}
                  />
                </div>
              </MetricCard>

              <MetricCard
                title="Coverage"
                icon={<Network className="w-5 h-5" />}
                color="purple"
              >
                <div className="space-y-2">
                  <MetricRow
                    label="Total Chains"
                    value={(
                      selectedResult.metrics.coverage?.chains || 0
                    ).toString()}
                  />
                  <MetricRow
                    label="Sampling Size"
                    value={selectedResult.metrics.latency.samples.toString()}
                  />
                  <MetricRow label="Status" value={selectedResult.status} />
                </div>
              </MetricCard>
            </div>

            {selectedResult.metrics.coverage?.chainsSupported &&
              selectedResult.metrics.coverage.chainsSupported.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Supported Chains ({selectedResult.metrics.coverage.chains})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-lg">
                    {selectedResult.metrics.coverage.chainsSupported.map(
                      chain => (
                        <div
                          key={chain}
                          className="px-3 py-2 bg-white rounded-lg text-xs font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {chain.charAt(0).toUpperCase() + chain.slice(1)}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
