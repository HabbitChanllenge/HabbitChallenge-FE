export default function PasswordVisibilityIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m3 3 18 18M10.6 5.2A10.8 10.8 0 0 1 12 5c6.2 0 9.5 7 9.5 7a15 15 0 0 1-3.2 4.1M6.2 6.3C3.8 8 2.5 12 2.5 12s3.3 7 9.5 7c1.2 0 2.3-.3 3.2-.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
