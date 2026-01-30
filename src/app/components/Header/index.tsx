import { UnifiedBenchmarkResult } from "@/app/providers/types";
import { motion } from "framer-motion";
import { InfoBadge } from "../InfoBadge";
import { Database, Network, Activity } from "lucide-react";

export interface BenchmarkResponse {
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

export const Header = ({ config }: { config: BenchmarkResponse["config"] }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Covalent Vibe | Dashboard
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Real-time performance metrics across multiple providers
        </p>
      </div>
      <div className="hidden md:flex gap-4">
        <InfoBadge
          icon={<Network className="w-4 h-4" />}
          label="Chain"
          value={config.chain.toString()}
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
