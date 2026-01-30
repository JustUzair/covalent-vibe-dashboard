import { UnifiedBenchmarkResult } from "@/app/providers/types";
import { motion } from "framer-motion";
import { Clock, Network } from "lucide-react";

export const DataFreshnessCard = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-white/20"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Clock className="w-5 h-5 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Data Freshness</h2>
    </div>

    <div className="space-y-4">
      {results.map(result => (
        <div
          key={result.provider}
          className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900 capitalize">
              {result.provider}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                result.metrics.dataFreshness.blockLag === 0
                  ? "bg-green-100 text-green-700"
                  : result.metrics.dataFreshness.blockLag <= 2
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {result.metrics.dataFreshness.blockLag === 0
                ? "Live"
                : `${result.metrics.dataFreshness.blockLag} blocks behind`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-slate-500">Chain Head</div>
              <div className="font-mono text-slate-900">
                {result.metrics.dataFreshness.chainHead.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Last Block</div>
              <div className="font-mono text-slate-900">
                {result.metrics.dataFreshness.lastBlock.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export const CoverageCard = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => {
  const sortedResults = [...results].sort(
    (a, b) =>
      (b.metrics.coverage?.chains || 0) - (a.metrics.coverage?.chains || 0),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Network className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Chain Coverage</h2>
      </div>

      <div className="space-y-4">
        {sortedResults.map((result, index) => {
          const chainCount = result.metrics.coverage?.chains || 0;
          console.log(`${result.provider}`, result);

          const maxChains = Math.max(
            ...results.map(r => r.metrics.coverage?.chains || 0),
          );
          const percentage = (chainCount / maxChains) * 100;

          return (
            <div key={result.provider} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 capitalize">
                  {result.provider}
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {chainCount}
                </span>
              </div>
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className="h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
