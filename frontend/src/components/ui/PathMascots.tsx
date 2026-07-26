'use client';

import { motion } from 'framer-motion';

// ── Campfire Mascot (Roasting Marshmallow on Log) ───────────────────────────
export function CampfireMascot({ size = 110 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: `${size}px`,
        height: `${size * 1.1}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 120 140" width={size} height={size * 1.15} fill="none">
        {/* Shadow base */}
        <ellipse cx="60" cy="125" rx="45" ry="10" fill="#000000" opacity="0.35" />

        {/* Wooden Log */}
        <ellipse cx="60" cy="110" rx="22" ry="7" fill="#8B5A2B" />
        <path d="M38 110 v12 c0 4 10 7 22 7 s22 -3 22 -7 v-12 Z" fill="#654321" />

        {/* Campfire Log Structure */}
        <rect x="35" y="118" width="22" height="6" rx="2" fill="#5c3818" transform="rotate(-15 35 118)" />
        <rect x="62" y="118" width="22" height="6" rx="2" fill="#4a2d13" transform="rotate(15 62 118)" />

        {/* Campfire Flame */}
        <motion.path
          animate={{ scale: [1, 1.12, 0.95, 1], opacity: [0.9, 1, 0.85, 0.9] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          d="M50 116 C45 100 55 90 60 82 C65 90 75 100 70 116 Z"
          fill="#FF4500"
        />
        <motion.path
          animate={{ scale: [1, 1.18, 0.9, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          d="M53 116 C48 104 56 96 60 88 C64 96 72 104 67 116 Z"
          fill="#FF8C00"
        />
        <motion.path
          animate={{ scale: [0.9, 1.1, 0.95] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          d="M56 116 C53 108 58 102 60 96 C62 102 67 108 64 116 Z"
          fill="#FFD700"
        />

        {/* Character Body (sitting on log) */}
        {/* Legs */}
        <path d="M45 100 L38 114" stroke="#1cb0f6" strokeWidth="10" strokeLinecap="round" />
        <path d="M68 100 L76 114" stroke="#1cb0f6" strokeWidth="10" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="36" cy="116" rx="6" ry="4" fill="#ff4b4b" />
        <ellipse cx="78" cy="116" rx="6" ry="4" fill="#ff4b4b" />

        {/* Torso */}
        <path d="M42 75 Q56 70 70 75 L67 100 Q56 103 45 100 Z" fill="#ff9600" />
        {/* Headband / shirt accent */}
        <rect x="42" y="73" width="28" height="5" fill="#ffc800" rx="2" />

        {/* Head & Hair */}
        <circle cx="56" cy="56" r="18" fill="#8d5524" /> {/* Skin */}
        {/* Afro / Curly Hair */}
        <circle cx="56" cy="40" r="16" fill="#2d2d2d" />
        <circle cx="42" cy="46" r="12" fill="#2d2d2d" />
        <circle cx="70" cy="46" r="12" fill="#2d2d2d" />
        <circle cx="56" cy="34" r="14" fill="#2d2d2d" />
        {/* Yellow Bandana */}
        <path d="M40 48 Q56 42 72 48" stroke="#ffc800" strokeWidth="6" strokeLinecap="round" />

        {/* Eyes & Expression */}
        <circle cx="50" cy="54" r="3.5" fill="#ffffff" />
        <circle cx="62" cy="54" r="3.5" fill="#ffffff" />
        <circle cx="51" cy="54" r="1.8" fill="#111111" />
        <circle cx="63" cy="54" r="1.8" fill="#111111" />
        {/* Eyebrows */}
        <path d="M47 48 Q50 46 53 48" stroke="#2d2d2d" strokeWidth="2" fill="none" />
        <path d="M59 48 Q62 46 65 48" stroke="#2d2d2d" strokeWidth="2" fill="none" />
        {/* Mouth (Focus expression) */}
        <ellipse cx="56" cy="62" rx="3" ry="2.5" fill="#5c2d0c" />

        {/* Stick with Marshmallow */}
        <path d="M62 78 L42 98" stroke="#5c3818" strokeWidth="3" strokeLinecap="round" />
        {/* Marshmallow over flame */}
        <rect x="38" y="94" width="9" height="7" rx="2" fill="#fff8e7" stroke="#e6c280" strokeWidth="1" />
        <ellipse cx="37" cy="97" rx="2" ry="3.5" fill="#d49a37" /> {/* Toasted side */}
      </svg>
    </motion.div>
  );
}

// ── Tennis Character Mascot (Holding Tennis Racket) ─────────────────────────
export function TennisMascot({ size = 110 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: `${size}px`,
        height: `${size * 1.1}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 120 140" width={size} height={size * 1.15} fill="none">
        {/* Shadow base */}
        <ellipse cx="60" cy="128" rx="35" ry="8" fill="#000000" opacity="0.35" />

        {/* Legs & Shoes */}
        <path d="M48 98 L44 122" stroke="#ff4b4b" strokeWidth="9" strokeLinecap="round" />
        <path d="M68 98 L72 122" stroke="#ff4b4b" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="42" cy="124" rx="8" ry="4" fill="#ffffff" />
        <ellipse cx="74" cy="124" rx="8" ry="4" fill="#ffffff" />

        {/* Torso */}
        <path d="M42 70 Q56 66 70 70 L66 98 Q56 100 46 98 Z" fill="#ff9600" />
        {/* Shirt collar */}
        <path d="M50 70 L56 78 L62 70" stroke="#ffffff" strokeWidth="2.5" fill="none" />

        {/* Head & Hair */}
        <circle cx="56" cy="50" r="18" fill="#8d5524" />
        {/* Hair */}
        <circle cx="56" cy="34" r="16" fill="#2d2d2d" />
        <circle cx="40" cy="40" r="12" fill="#2d2d2d" />
        <circle cx="72" cy="40" r="12" fill="#2d2d2d" />
        <path d="M38 44 Q56 38 74 44" stroke="#ffc800" strokeWidth="6" strokeLinecap="round" />

        {/* Eyes & Smile */}
        <circle cx="50" cy="48" r="3.5" fill="#ffffff" />
        <circle cx="62" cy="48" r="3.5" fill="#ffffff" />
        <circle cx="51" cy="48" r="1.8" fill="#111111" />
        <circle cx="63" cy="48" r="1.8" fill="#111111" />
        <path d="M50 56 Q56 62 62 56" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Arm holding Racket */}
        <path d="M70 74 L88 88" stroke="#8d5524" strokeWidth="7" strokeLinecap="round" />
        {/* Racket Handle */}
        <rect x="86" y="86" width="16" height="4" rx="1.5" fill="#2b5a00" transform="rotate(45 86 86)" />
        {/* Racket Head */}
        <ellipse cx="102" cy="102" rx="12" ry="16" fill="none" stroke="#58cc02" strokeWidth="3" transform="rotate(45 102 102)" />
        {/* Racket Strings */}
        <path d="M96 96 L108 108 M98 104 L106 96" stroke="#58cc02" strokeWidth="1" />

        {/* Tennis Ball */}
        <circle cx="94" cy="74" r="6" fill="#ccff00" />
        <path d="M90 74 Q94 72 98 74" stroke="#ffffff" strokeWidth="1" fill="none" />
      </svg>
    </motion.div>
  );
}

// ── Treasure Chest Node (Milestone Goal) ───────────────────────────────────
export function TreasureChestNode({ size = 70 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: `${size}px`,
        height: `${size * 0.9}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        filter: 'drop-shadow(0 6px 12px rgba(255,200,0,0.4))',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 80 70" width={size} height={size * 0.9} fill="none">
        {/* Base shadow */}
        <ellipse cx="40" cy="62" rx="32" ry="7" fill="#000000" opacity="0.4" />

        {/* Chest Box Body */}
        <rect x="14" y="32" width="52" height="28" rx="4" fill="#8B4513" stroke="#5c2e0b" strokeWidth="2" />
        {/* Gold Trim Strips */}
        <rect x="14" y="32" width="8" height="28" fill="#FFD700" />
        <rect x="58" y="32" width="8" height="28" fill="#FFD700" />
        <rect x="14" y="44" width="52" height="4" fill="#DAA520" />

        {/* Lid (Arched Top) */}
        <path d="M14 32 C14 18 66 18 66 32 Z" fill="#A0522D" stroke="#5c2e0b" strokeWidth="2" />
        <path d="M14 32 C14 20 22 20 22 32 Z" fill="#FFD700" />
        <path d="M58 32 C58 20 66 20 66 32 Z" fill="#FFD700" />

        {/* Lock Plate */}
        <rect x="34" y="30" width="12" height="14" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
        <circle cx="40" cy="35" r="2.5" fill="#111111" />
        <path d="M40 37 L40 41" stroke="#111111" strokeWidth="2" />

        {/* Gold Glow Sparkles */}
        <motion.circle
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          cx="20" cy="20" r="3" fill="#FFD700"
        />
        <motion.circle
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
          cx="60" cy="18" r="4" fill="#FFD700"
        />
      </svg>
    </motion.div>
  );
}
