"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Zap,
  Database,
  TrendingUp,
  Clock,
  Network,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import LoadingSpinner from "../components/Loader";
import type { UnifiedBenchmarkResult } from "../providers/types";

interface BenchmarkResponse {
  success: boolean;
  config: {
    endpoint: string;
    chain: string;
    samples: number;
    timeout: number;
    address: string;
    timestamp: number;
  };
  results: UnifiedBenchmarkResult[];
}

const DashboardPage = () => {
  const [data, setData] = useState<BenchmarkResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenchmark = async () => {
      try {
        const response = await fetch("/api/benchmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: "getBalances",
            chain: "ethereum",
            samples: 5,
            address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          }),
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to fetch benchmark data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBenchmark();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="No data available" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header config={data.config} />
        <div className="grid gap-6 mt-8">
          <MetricsOverview results={data.results} />
          <LatencyComparison results={data.results} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataFreshnessCard results={data.results} />
            <CoverageCard results={data.results} />
          </div>
          <DetailedMetrics results={data.results} />
        </div>
      </div>
    </div>
  );
};

const Header = ({ config }: { config: BenchmarkResponse["config"] }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Blockchain API Benchmark
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Real-time performance metrics across multiple providers
        </p>
      </div>
      <div className="hidden md:flex gap-4">
        <InfoBadge
          icon={<Network className="w-4 h-4" />}
          label="Chain"
          value={config.chain}
        />
        <InfoBadge
          icon={<Activity className="w-4 h-4" />}
          label="Endpoint"
          value={config.endpoint}
        />
        <InfoBadge
          icon={<Database className="w-4 h-4" />}
          label="Samples"
          value={config.samples.toString()}
        />
      </div>
    </div>
  </motion.div>
);

const InfoBadge = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
    <div className="text-indigo-600">{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);

const MetricsOverview = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => {
  const successfulResults = results.filter(r => r.status === "success");
  const avgLatency =
    successfulResults.reduce((acc, r) => acc + r.metrics.latency.avg, 0) /
    successfulResults.length;
  const avgBlockLag =
    successfulResults.reduce(
      (acc, r) => acc + r.metrics.dataFreshness.blockLag,
      0,
    ) / successfulResults.length;
  const totalChains = Math.max(
    ...successfulResults.map(r => r.metrics.coverage?.chains || 0),
  );

  const cards = [
    {
      title: "Average Latency",
      value: `${avgLatency.toFixed(2)}ms`,
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Block Lag",
      value: avgBlockLag.toFixed(1),
      icon: <Clock className="w-6 h-6" />,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Providers Active",
      value: `${successfulResults.length}/${results.length}`,
      icon: <Activity className="w-6 h-6" />,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Max Chain Coverage",
      value: totalChains.toString(),
      icon: <Network className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white ${card.bgColor}/30`}
            >
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const LatencyComparison = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => {
  const providerColors: Record<string, string> = {
    covalent: "bg-gradient-to-r from-indigo-500 to-purple-600",
    alchemy: "bg-gradient-to-r from-blue-500 to-cyan-600",
    mobula: "bg-gradient-to-r from-emerald-500 to-teal-600",
    codex: "bg-gradient-to-r from-amber-500 to-orange-600",
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
              <div className="absolute inset-y-0 left-0 flex items-center px-3 z-10">
                <span className="text-xs font-medium text-white drop-shadow-lg">
                  Min: {result.metrics.latency.min.toFixed(2)}ms
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(result.metrics.latency.avg / maxLatency) * 100}%`,
                }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className={`h-full ${providerColors[result.provider]} flex items-center justify-end px-3`}
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

const DataFreshnessCard = ({
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

const CoverageCard = ({ results }: { results: UnifiedBenchmarkResult[] }) => {
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
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const DetailedMetrics = ({
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
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedProvider === result.provider
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
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
                icon={<Zap className="w-5 h-5" />}
                color="amber"
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
                    value={selectedResult.metrics.dataFreshness.blockLag.toString()}
                  />
                  <MetricRow
                    label="Time Delta"
                    value={`${selectedResult.metrics.dataFreshness.timestampDelta}s`}
                  />
                  <MetricRow
                    label="Chain Head"
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
                    label="Samples"
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
                          {chain}
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

const MetricCard = ({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 bg-slate-50 rounded-xl">
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-2 bg-${color}-100 rounded-lg text-${color}-600`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    {children}
  </div>
);

const MetricRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-1 border-b border-slate-200 last:border-0">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center"
    >
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
      <p className="text-slate-600">{message}</p>
    </motion.div>
  </div>
);

export default DashboardPage;
