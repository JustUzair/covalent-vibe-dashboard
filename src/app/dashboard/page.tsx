"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/app/components/Loader";

import { MetricsOverview } from "@/app/components/MetricsOverview";
import { BenchmarkResponse, Header } from "@/app/components/Header";
import { DataFreshnessCard, CoverageCard } from "../components/Cards";
import { LatencyComparison } from "../components/Metrics/LatencyComparison";
import { DetailedMetrics } from "../components/Metrics/DetailedMetrics";

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
            chain: "Ethereum",
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
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

const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-linear-to-br from-slate-50 to-red-50 flex items-center justify-center">
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
