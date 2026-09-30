// Brand mark: cow head framed by detection corners (livestock + computer vision).
export function LogoMark({ size = 36, id = "kt-logo", className }: { size?: number; id?: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} role="img" aria-label="KotoshTech">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16a34a" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <path
        d="M11 20v-5a4 4 0 0 1 4-4h5M44 11h5a4 4 0 0 1 4 4v5M53 44v5a4 4 0 0 1-4 4h-5M20 53h-5a4 4 0 0 1-4-4v-5"
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity=".75"
      />
      <path d="M24.5 22.5c-3.2-.6-5.6-3.3-5.8-6.8M39.5 22.5c3.2-.6 5.6-3.3 5.8-6.8" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M23 26.5c-4.4-.6-7.8.6-9.4 2.9 2.7 2.2 6.4 2.8 10.1 1.6zM41 26.5c4.4-.6 7.8.6 9.4 2.9-2.7 2.2-6.4 2.8-10.1 1.6z" fill="#fff" />
      <path d="M22.4 25.2c0-2.4 1.9-4.2 4.3-4.2h10.6c2.4 0 4.3 1.8 4.3 4.2l-1.9 12.3H24.3z" fill="#fff" />
      <rect x="21.6" y="35" width="20.8" height="12.6" rx="6.3" fill="#fff" />
      <circle cx="27.6" cy="29.3" r="1.9" fill="#166534" />
      <circle cx="36.4" cy="29.3" r="1.9" fill="#166534" />
      <ellipse cx="28" cy="41.3" rx="1.6" ry="1.9" fill="#0e7490" />
      <ellipse cx="36" cy="41.3" rx="1.6" ry="1.9" fill="#0e7490" />
    </svg>
  );
}
