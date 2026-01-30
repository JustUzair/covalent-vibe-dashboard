import { UnifiedBenchmarkResult } from "@/app/providers/types";
import { motion } from "framer-motion";
import { Zap, Clock, Network, Activity } from "lucide-react";

export const MetricsOverview = ({
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
  const maxBlockLag = Math.max(
    ...successfulResults.map(r => r.metrics.dataFreshness.blockLag),
  );

  const totalChains = Math.max(
    ...successfulResults.map(r => r.metrics.coverage?.chains || 0),
  );

  const cards = [
    {
      title: "Avg. Latency",
      value: `${avgLatency.toFixed(2)}ms`,
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Max Block Lag",
      value: `~${maxBlockLag.toString()} Blocks `,
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
              className={`p-3 rounded-xl bg-linear-to-br ${card.color} text-white ${card.bgColor}/30`}
            >
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
