import { UnifiedBenchmarkResult } from "../providers/types";

// Percentile Donut Chart Configuration
const percentileDonutOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "donut",
    fontFamily: "inherit",
  },
  labels: ["P50", "P95", "P99"],
  colors: ["#8b5cf6", "#f59e0b", "#ef4444"],
  legend: {
    position: "bottom",
    fontSize: "14px",
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
  },

  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}ms`,
    },
  },
};

// Latency Bar Chart Configuration
const latencyBarOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    fontFamily: "inherit",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 8,
      distributed: true,
      dataLabels: {
        position: "top",
      },
    },
  },
  colors: ["#10b981", "#6366f1", "#8b5cf6", "#f59e0b", "#ef4444", "#dc2626"],
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}ms`,
    offsetX: 30,
    style: {
      fontSize: "12px",
      fontWeight: 600,
      colors: [
        `#878787`,
        `#878787`,
        `#878787`,
        `#878787`,
        `#878787`,
        `#878787`,
      ],
    },
  },
  xaxis: {
    categories: ["Min", "Avg", "P50", "P95", "P99", "Max"],
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}ms`,
    },
  },
};

// Provider Comparison Radar Chart
const getProviderRadarData = (results: UnifiedBenchmarkResult[]) => {
  const maxLatency = Math.max(...results.map(r => r.metrics.latency.avg));
  const maxChains = Math.max(
    ...results.map(r => r.metrics.coverage?.chains || 0),
  );

  return results
    .filter(r => r.status === "success")
    .map(r => ({
      name: r.provider.charAt(0).toUpperCase() + r.provider.slice(1),
      data: [
        // Normalize to 100 scale (inverted for latency - lower is better)
        100 - (r.metrics.latency.avg / maxLatency) * 100,
        // Data freshness (inverted - lower lag is better)
        100 - (r.metrics.dataFreshness.blockLag / 10) * 100,
        // Coverage
        ((r.metrics.coverage?.chains || 0) / maxChains) * 100,
        // Consistency (based on std deviation)
        100 -
          ((r.metrics.latency.max - r.metrics.latency.min) / maxLatency) * 100,
      ],
    }));
};

const providerRadarOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "radar",
    fontFamily: "inherit",
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ["Speed", "Freshness", "Coverage", "Consistency"],
    labels: {
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
  },
  yaxis: {
    show: false,
    max: 100,
  },
  colors: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"],
  stroke: {
    width: 2,
  },
  fill: {
    opacity: 0.2,
  },
  markers: {
    size: 4,
  },
  legend: {
    position: "bottom",
    fontSize: "14px",
  },
};

// Block Lag Gauge Chart
const blockLagGaugeOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "radialBar",
    fontFamily: "inherit",
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        size: "65%",
      },
      track: {
        background: "#e5e7eb",
        strokeWidth: "100%",
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: "14px",
          fontWeight: 600,
          offsetY: -10,
        },
        value: {
          show: true,
          fontSize: "32px",
          fontWeight: 700,
          offsetY: 5,
          formatter: (val: number) => {
            const lag = Math.round((10 * (100 - val)) / 100);
            return lag === 0 ? "Live" : `${lag}`;
          },
        },
      },
    },
  },
};

export {
  percentileDonutOptions,
  latencyBarOptions,
  getProviderRadarData,
  providerRadarOptions,
  blockLagGaugeOptions,
};
