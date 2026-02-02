import { UnifiedBenchmarkResult } from "@/app/providers/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Clock,
  Network,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  latencyBarOptions,
  percentileDonutOptions,
  blockLagGaugeOptions,
  providerRadarOptions,
  getProviderRadarData,
} from "@/app/utils/constants";
import { MetricCard, MetricRow } from "../MetricCard";

// Dynamic import for ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const DetailedMetrics = ({
  results,
}: {
  results: UnifiedBenchmarkResult[];
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(
    results[0]?.provider || null,
  );

  const selectedResult = results.find(r => r.provider === selectedProvider);

  if (!selectedResult) return null;

  const { latency, dataFreshness, coverage } = selectedResult.metrics;

  const blockLagGaugeSeries = [100 - (dataFreshness.blockLag / 10) * 100];
  const percentileDonutSeries = [latency.p50, latency.p95, latency.p99];
  const latencyBarSeries = [
    {
      name: "Latency",
      data: [
        latency.min,
        latency.avg,
        latency.p50,
        latency.p95,
        latency.p99,
        latency.max,
      ],
    },
  ];
  const providerRadarSeries = getProviderRadarData(results);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Detailed Metrics & Analytics
        </h2>
      </div>

      {/* Provider Selection Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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
            className="space-y-8"
          >
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latency Bar Chart */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Latency Breakdown
                  </h3>
                </div>
                <Chart
                  options={latencyBarOptions}
                  series={latencyBarSeries}
                  type="bar"
                  height={300}
                />
              </div>

              {/* Percentile Donut Chart */}
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Percentile Distribution
                  </h3>
                </div>
                <Chart
                  options={{
                    ...percentileDonutOptions,
                    plotOptions: {
                      pie: {
                        donut: {
                          size: "60%",
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              fontSize: "16px",
                              fontWeight: 600,
                            },
                            value: {
                              show: true,
                              fontSize: "24px",
                              fontWeight: 700,
                              formatter: (val: string) =>
                                `${parseFloat(val).toFixed(0)}ms`,
                            },
                            total: {
                              show: true,
                              label: "P95",
                              fontSize: "14px",
                              fontWeight: 600,
                              formatter: () => `${latency.p95.toFixed(0)}ms`,
                            },
                          },
                        },
                      },
                    },
                  }}
                  series={percentileDonutSeries}
                  type="donut"
                  height={300}
                />
              </div>

              {/* Block Lag Gauge */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Data Freshness
                  </h3>
                </div>
                <Chart
                  options={{
                    ...blockLagGaugeOptions,
                    fill: {
                      type: "gradient",
                      gradient: {
                        shade: "dark",
                        type: "horizontal",
                        shadeIntensity: 0.5,
                        gradientToColors:
                          dataFreshness.blockLag === 0
                            ? ["#10b981"]
                            : dataFreshness.blockLag <= 2
                              ? ["#f59e0b"]
                              : ["#ef4444"],
                        inverseColors: false,
                        opacityFrom: 0.8,
                        opacityTo: 1,
                        stops: [0, 100],
                      },
                    },
                    labels: [
                      dataFreshness.blockLag === 0 ? "Synced" : "Blocks Behind",
                    ],
                  }}
                  series={blockLagGaugeSeries}
                  type="radialBar"
                  height={280}
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-slate-500">Chain Head</div>
                    <div className="text-lg font-bold text-slate-900">
                      {dataFreshness.chainHead.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-slate-500">Last Block</div>
                    <div className="text-lg font-bold text-slate-900">
                      {dataFreshness.lastBlock.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Comparison Radar */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Provider Comparison
                  </h3>
                </div>
                <Chart
                  options={providerRadarOptions}
                  series={providerRadarSeries}
                  type="radar"
                  height={300}
                />
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Avg Latency"
                value={`${latency.avg.toFixed(2)}ms`}
                color="blue"
              />
              <MetricCard
                label="Min Latency"
                value={`${latency.min.toFixed(2)}ms`}
                color="green"
              />
              <MetricCard
                label="Max Latency"
                value={`${latency.max.toFixed(2)}ms`}
                color="red"
              />
              <MetricCard
                label="Samples"
                value={latency.samples.toString()}
                color="purple"
              />
            </div>

            {/* Detailed Stats Table */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Latency Statistics
                  </h4>
                  <div className="space-y-2">
                    <MetricRow
                      label="Average"
                      value={`${latency.avg.toFixed(2)}ms`}
                    />
                    <MetricRow
                      label="Minimum"
                      value={`${latency.min.toFixed(2)}ms`}
                    />
                    <MetricRow
                      label="Maximum"
                      value={`${latency.max.toFixed(2)}ms`}
                    />
                    <MetricRow
                      label="P50 (Median)"
                      value={`${latency.p50.toFixed(2)}ms`}
                    />
                    <MetricRow
                      label="P95"
                      value={`${latency.p95.toFixed(2)}ms`}
                    />
                    <MetricRow
                      label="P99"
                      value={`${latency.p99.toFixed(2)}ms`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Data Freshness
                  </h4>
                  <div className="space-y-2">
                    <MetricRow
                      label="Block Lag"
                      value={`${dataFreshness.blockLag} blocks`}
                    />
                    <MetricRow
                      label="Time Delta"
                      value={`${dataFreshness.timestampDelta}s`}
                    />
                    <MetricRow
                      label="Chain Head"
                      value={dataFreshness.chainHead.toLocaleString()}
                    />
                    <MetricRow
                      label="Last Block"
                      value={dataFreshness.lastBlock.toLocaleString()}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Coverage & Status
                  </h4>
                  <div className="space-y-2">
                    <MetricRow
                      label="Chains Supported"
                      value={(coverage?.chains || 0).toString()}
                    />
                    <MetricRow
                      label="Samples Tested"
                      value={latency.samples.toString()}
                    />
                    <MetricRow
                      label="Status"
                      value={
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedResult.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedResult.status}
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Chains */}
            {coverage?.chainsSupported &&
              coverage.chainsSupported.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Supported Chains ({coverage.chains})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-lg">
                    {coverage.chainsSupported.map(chain => (
                      <div
                        key={chain}
                        className="px-3 py-2 bg-white rounded-lg text-xs font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {chain}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
