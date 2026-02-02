export const MetricCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    purple: "from-purple-500 to-pink-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div
        className={`text-2xl font-bold bg-linear-to-r ${colors[color]} bg-clip-text text-transparent`}
      >
        {value}
      </div>
    </div>
  );
};

export const MetricRow = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-900">{value}</span>
  </div>
);
