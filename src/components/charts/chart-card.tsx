interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
