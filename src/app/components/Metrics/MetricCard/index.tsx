export const MetricCard = ({
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

export const MetricRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex justify-between items-center py-1 border-b border-slate-200 last:border-0">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-900">{value}</span>
  </div>
);
