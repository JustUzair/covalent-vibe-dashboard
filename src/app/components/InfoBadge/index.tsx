export const InfoBadge = ({
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
