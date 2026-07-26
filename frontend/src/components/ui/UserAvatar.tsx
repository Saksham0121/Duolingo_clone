'use client';

import Image from 'next/image';

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: number; // width/height in px
  showBadge?: boolean;
  badgeIcon?: string;
  className?: string;
  preferImage?: boolean; // if true and avatarUrl is set, renders image instead of initial
}

const TWO_TONE_GRADIENTS = [
  'linear-gradient(135deg, #58cc02, #2b5a00)', // Duo Green
  'linear-gradient(135deg, #1cb0f6, #0d8fd4)', // Duo Blue
  'linear-gradient(135deg, #ff9600, #ea2b2b)', // Orange to Red
  'linear-gradient(135deg, #ce82ff, #7c3aed)', // Duo Purple
  'linear-gradient(135deg, #ffc800, #d97706)', // Duo Yellow
  'linear-gradient(135deg, #06b6d4, #3b82f6)', // Cyan to Blue
  'linear-gradient(135deg, #ec4899, #8b5cf6)', // Pink to Violet
];

function getGradientForUsername(username: string): string {
  if (!username) return TWO_TONE_GRADIENTS[0];
  let charSum = 0;
  for (let i = 0; i < username.length; i++) {
    charSum += username.charCodeAt(i);
  }
  return TWO_TONE_GRADIENTS[charSum % TWO_TONE_GRADIENTS.length];
}

export default function UserAvatar({
  username,
  avatarUrl,
  size = 36,
  showBadge = false,
  badgeIcon = '👤',
  className = '',
  preferImage = false,
}: UserAvatarProps) {
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  const gradient = getGradientForUsername(username);

  const shouldRenderImage = preferImage && !!avatarUrl;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      {shouldRenderImage ? (
        <Image
          src={avatarUrl!}
          alt={username}
          width={size}
          height={size}
          style={{
            borderRadius: '9999px',
            objectFit: 'cover',
            border: '2px solid var(--color-bg-border)',
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      ) : (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '9999px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: `${size * 0.48}px`,
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.25)',
            userSelect: 'none',
            fontFamily: "'Nunito', sans-serif",
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {initial}
        </div>
      )}

      {/* Top right status badge icon */}
      {showBadge && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: `${Math.max(16, size * 0.38)}px`,
            height: `${Math.max(16, size * 0.38)}px`,
            borderRadius: '9999px',
            backgroundColor: 'var(--color-bg-card)',
            border: '1.5px solid var(--color-bg-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.max(9, size * 0.24)}px`,
            lineHeight: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        >
          {badgeIcon}
        </div>
      )}
    </div>
  );
}
