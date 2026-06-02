import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #020202 100%)',
          borderRadius: 40,
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <rect x="26" y="6" width="12" height="52" rx="4" transform="rotate(45 32 32)" fill="url(#g)" />
          <rect x="26" y="6" width="12" height="52" rx="4" transform="rotate(-45 32 32)" fill="url(#g)" />
          <rect x="30" y="20" width="4" height="24" rx="2" transform="rotate(45 32 32)" fill="#020202" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
