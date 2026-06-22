import clsx from 'clsx';

interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  title,
  description,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
