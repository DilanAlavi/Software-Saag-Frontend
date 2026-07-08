export function IconoExcel({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="40" rx="6" fill="#1D6F42" />
      <rect x="4" y="4" width="40" height="40" rx="6" fill="none" stroke="#14532d" strokeWidth="1" />
      <path
        d="M16 15 L21.5 24 L16 33 H20 L23.5 27 L27 33 H31 L25.5 24 L31 15 H27 L23.5 21 L20 15 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
