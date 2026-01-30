import { UnifiedBenchmarkResult } from "@/app/providers/types";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

export const LatencyComparison = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => {
  const providerColors: Record<string, string> = {
    covalent: "bg-linear-to-r from-indigo-500 to-purple-600",
    alchemy: "bg-linear-to-r from-blue-500 to-cyan-600",
    mobula: "bg-linear-to-r from-emerald-500 to-teal-600",
    codex: "bg-linear-to-r from-amber-500 to-orange-600",
  };

  const maxLatency = Math.max(...results.map(r => r.metrics.latency.max || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Latency Performance
        </h2>
      </div>

      <div className="space-y-6">
        {results.map((result, index) => (
          <motion.div
            key={result.provider}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-slate-900 capitalize">
                  {result.provider}
                </span>
                {result.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Avg Latency</div>
                <div className="text-lg font-bold text-slate-900">
                  {result.metrics.latency.avg.toFixed(2)}ms
                </div>
              </div>
            </div>

            <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
              <div className="absolute inset-y-0 left-0 flex items-center px-5 z-10">
                <span className="text-xs font-medium text-white drop-shadow-lg">
                  Min: {result.metrics.latency.min.toFixed(2)}ms
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `max(40%, ${(result.metrics.latency.avg / maxLatency) * 100}%)`,
                }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className={`h-full ${providerColors[result.provider]} flex items-center justify-end pr-3 pl-20`}
              >
                <span className="text-xs font-medium text-white">
                  Max: {result.metrics.latency.max.toFixed(2)}ms
                </span>
              </motion.div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <div>P50: {result.metrics.latency.p50.toFixed(2)}ms</div>
              <div>P95: {result.metrics.latency.p95.toFixed(2)}ms</div>
              <div>P99: {result.metrics.latency.p99.toFixed(2)}ms</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
