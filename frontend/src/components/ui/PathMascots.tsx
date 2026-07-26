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
        height: `${size * 1.15}px`,
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
        <ellipse cx="60" cy="125" rx="45" ry="10" fill="#000000" opacity="0.35" />
        <ellipse cx="60" cy="110" rx="22" ry="7" fill="#8B5A2B" />
        <path d="M38 110 v12 c0 4 10 7 22 7 s22 -3 22 -7 v-12 Z" fill="#654321" />
        <rect x="35" y="118" width="22" height="6" rx="2" fill="#5c3818" transform="rotate(-15 35 118)" />
        <rect x="62" y="118" width="22" height="6" rx="2" fill="#4a2d13" transform="rotate(15 62 118)" />
        <motion.path animate={{ scale: [1, 1.12, 0.95, 1], opacity: [0.9, 1, 0.85, 0.9] }} transition={{ duration: 0.8, repeat: Infinity }} d="M50 116 C45 100 55 90 60 82 C65 90 75 100 70 116 Z" fill="#FF4500" />
        <motion.path animate={{ scale: [1, 1.18, 0.9, 1] }} transition={{ duration: 0.6, repeat: Infinity }} d="M53 116 C48 104 56 96 60 88 C64 96 72 104 67 116 Z" fill="#FF8C00" />
        <motion.path animate={{ scale: [0.9, 1.1, 0.95] }} transition={{ duration: 0.5, repeat: Infinity }} d="M56 116 C53 108 58 102 60 96 C62 102 67 108 64 116 Z" fill="#FFD700" />
        <path d="M45 100 L38 114" stroke="#1cb0f6" strokeWidth="10" strokeLinecap="round" />
        <path d="M68 100 L76 114" stroke="#1cb0f6" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="36" cy="116" rx="6" ry="4" fill="#ff4b4b" />
        <ellipse cx="78" cy="116" rx="6" ry="4" fill="#ff4b4b" />
        <path d="M42 75 Q56 70 70 75 L67 100 Q56 103 45 100 Z" fill="#ff9600" />
        <circle cx="56" cy="56" r="18" fill="#8d5524" />
        <circle cx="56" cy="40" r="16" fill="#2d2d2d" />
        <circle cx="50" cy="54" r="3.5" fill="#ffffff" />
        <circle cx="62" cy="54" r="3.5" fill="#ffffff" />
        <circle cx="51" cy="54" r="1.8" fill="#111111" />
        <circle cx="63" cy="54" r="1.8" fill="#111111" />
        <path d="M62 78 L42 98" stroke="#5c3818" strokeWidth="3" strokeLinecap="round" />
        <rect x="38" y="94" width="9" height="7" rx="2" fill="#fff8e7" stroke="#e6c280" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

// ── BBQ Chef Mascot with Turban & Skewers (Matching Screenshot!) ─────────────
export function BBQChefMascot({ size = 120 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: `${size}px`,
        height: `${size * 1.15}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45))',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 130 150" width={size} height={size * 1.15} fill="none">
        {/* Shadow base */}
        <ellipse cx="65" cy="135" rx="48" ry="10" fill="#000000" opacity="0.35" />

        {/* BBQ Grill Stand */}
        <line x1="78" y1="95" x2="68" y2="135" stroke="#333333" strokeWidth="5" strokeLinecap="round" />
        <line x1="98" y1="95" x2="108" y2="135" stroke="#333333" strokeWidth="5" strokeLinecap="round" />
        <line x1="88" y1="95" x2="88" y2="135" stroke="#333333" strokeWidth="5" strokeLinecap="round" />

        {/* Grill Bowl & Cover Lid */}
        <ellipse cx="88" cy="95" rx="22" ry="10" fill="#cc2222" stroke="#991111" strokeWidth="2" />
        {/* Open Lid in Hand */}
        <ellipse cx="102" cy="72" rx="14" ry="10" fill="#ee2222" stroke="#aa1111" strokeWidth="2" transform="rotate(-30 102 72)" />
        <rect x="100" y="60" width="4" height="6" fill="#111111" rx="1" transform="rotate(-30 100 60)" />

        {/* Hot Grill Surface & Skewers */}
        <ellipse cx="88" cy="93" rx="19" ry="7" fill="#222222" />
        {/* Skewers on Grill */}
        <line x1="74" y1="93" x2="98" y2="90" stroke="#cccccc" strokeWidth="2" />
        <circle cx="78" cy="92" r="3" fill="#ff4400" />
        <circle cx="85" cy="91" r="3" fill="#ffbb00" />
        <circle cx="92" cy="91" r="3" fill="#58cc02" />

        <line x1="76" y1="96" x2="100" y2="94" stroke="#cccccc" strokeWidth="2" />
        <circle cx="82" cy="95" r="3" fill="#ffbb00" />
        <circle cx="89" cy="95" r="3" fill="#ff4400" />
        <circle cx="95" cy="94" r="3" fill="#58cc02" />

        {/* Rising Grill Smoke */}
        <motion.path
          animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -8, -16] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          d="M82 86 Q86 80 84 74" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round"
        />
        <motion.path
          animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -8, -16] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.5 }}
          d="M92 86 Q96 80 94 74" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round"
        />

        {/* Character Legs & Boots */}
        <path d="M42 100 L38 128" stroke="#1cb0f6" strokeWidth="11" strokeLinecap="round" />
        <path d="M58 100 L62 128" stroke="#1cb0f6" strokeWidth="11" strokeLinecap="round" />
        <ellipse cx="36" cy="130" rx="8" ry="4" fill="#ce82ff" />
        <ellipse cx="64" cy="130" rx="8" ry="4" fill="#ce82ff" />

        {/* Torso & Pink Shirt */}
        <path d="M34 68 Q50 64 66 68 L62 102 Q50 105 38 102 Z" fill="#d946ef" />

        {/* Apron */}
        <path d="M40 76 L60 76 L58 102 L42 102 Z" fill="#ffedd5" />
        <path d="M44 68 L44 76 M56 68 L56 76" stroke="#ea580c" strokeWidth="2" />

        {/* Head & Skin */}
        <circle cx="50" cy="52" r="18" fill="#8d5524" />

        {/* Turban (Blue Turban - Exact Match!) */}
        <ellipse cx="50" cy="38" rx="20" ry="14" fill="#0284c7" />
        <path d="M30 38 Q50 26 70 38 Q50 44 30 38 Z" fill="#0369a1" />
        <circle cx="50" cy="32" r="4" fill="#0284c7" />

        {/* Full Black Beard */}
        <path d="M34 50 Q50 78 66 50 Q50 68 34 50 Z" fill="#1f2937" />

        {/* Closed Peaceful Eyes & Nose */}
        <path d="M42 48 Q46 52 50 48" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M52 48 Q56 52 60 48" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="51" cy="53" r="2.5" fill="#6c3b17" />
      </svg>
    </motion.div>
  );
}

// ── Gardener Mascot Watering Flowers (Matching Screenshot!) ──────────────────
export function WateringGardenerMascot({ size = 120 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: `${size}px`,
        height: `${size * 1.15}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45))',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 130 150" width={size} height={size * 1.15} fill="none">
        {/* Shadow base */}
        <ellipse cx="65" cy="135" rx="48" ry="10" fill="#000000" opacity="0.35" />

        {/* Potted Flower Pot */}
        <ellipse cx="98" cy="128" rx="14" ry="5" fill="#000000" opacity="0.3" />
        <path d="M86 112 L89 130 Q98 134 107 130 L110 112 Z" fill="#ea580c" />
        <rect x="84" y="108" width="28" height="5" rx="2" fill="#c2410c" />
        {/* Flowers */}
        <circle cx="92" cy="102" r="5" fill="#ce82ff" />
        <circle cx="104" cy="104" r="5" fill="#ce82ff" />
        <circle cx="98" cy="98" r="5.5" fill="#38bdf8" />
        <circle cx="98" cy="98" r="2" fill="#ffc800" />
        <circle cx="92" cy="102" r="1.8" fill="#ffc800" />
        <circle cx="104" cy="104" r="1.8" fill="#ffc800" />

        {/* Character Legs & Shoes */}
        <path d="M42 98 L36 124" stroke="#0284c7" strokeWidth="11" strokeLinecap="round" />
        <path d="M58 98 L64 124" stroke="#0284c7" strokeWidth="11" strokeLinecap="round" />
        <ellipse cx="34" cy="126" rx="8" ry="4" fill="#d946ef" />
        <ellipse cx="66" cy="126" rx="8" ry="4" fill="#d946ef" />

        {/* Torso & Pink Shirt */}
        <path d="M34 68 Q50 64 66 68 L62 100 Q50 103 38 100 Z" fill="#d946ef" />

        {/* Blue Watering Can & Water Flow */}
        <path d="M64 74 L84 80 L80 96 L60 90 Z" fill="#0284c7" />
        <path d="M84 80 L96 74" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="97" cy="74" rx="4" ry="2" fill="#0369a1" />
        {/* Water Stream (Arc flowing to flowers!) */}
        <motion.path
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          d="M97 76 C105 84 105 95 98 104" stroke="#38bdf8" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="6 3"
        />

        {/* Head & Skin */}
        <circle cx="50" cy="50" r="18" fill="#8d5524" />

        {/* Blue Turban */}
        <ellipse cx="50" cy="36" rx="20" ry="14" fill="#0284c7" />
        <path d="M30 36 Q50 24 70 36 Q50 42 30 36 Z" fill="#0369a1" />
        <circle cx="50" cy="30" r="4" fill="#0284c7" />

        {/* Full Black Beard */}
        <path d="M34 48 Q50 76 66 48 Q50 66 34 48 Z" fill="#1f2937" />

        {/* Eyes looking at flowers & Big Happy Smile */}
        <circle cx="45" cy="46" r="3" fill="#ffffff" />
        <circle cx="57" cy="46" r="3" fill="#ffffff" />
        <circle cx="46" cy="47" r="1.6" fill="#111111" />
        <circle cx="58" cy="47" r="1.6" fill="#111111" />
        <path d="M47 54 Q51 58 55 54" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

// ── Treasure Chest Node (Milestone Goal) ───────────────────────────────────
export function TreasureChestNode({ size = 72 }: { size?: number }) {
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
        filter: 'drop-shadow(0 6px 14px rgba(255,200,0,0.45))',
        userSelect: 'none',
      }}
    >
      <svg viewBox="0 0 80 70" width={size} height={size * 0.9} fill="none">
        {/* Base shadow */}
        <ellipse cx="40" cy="62" rx="32" ry="7" fill="#000000" opacity="0.4" />

        {/* Chest Box Body */}
        <rect x="14" y="32" width="52" height="28" rx="4" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
        <rect x="14" y="32" width="8" height="28" fill="#DAA520" />
        <rect x="58" y="32" width="8" height="28" fill="#DAA520" />
        <rect x="14" y="44" width="52" height="4" fill="#B8860B" />

        {/* Lid (Arched Top) */}
        <path d="M14 32 C14 18 66 18 66 32 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
        <path d="M14 32 C14 20 22 20 22 32 Z" fill="#DAA520" />
        <path d="M58 32 C58 20 66 20 66 32 Z" fill="#DAA520" />

        {/* Lock Plate */}
        <rect x="34" y="30" width="12" height="14" rx="2" fill="#5c2e0b" stroke="#3d1e07" strokeWidth="1.5" />
        <circle cx="40" cy="35" r="2.5" fill="#FFD700" />
        <path d="M40 37 L40 41" stroke="#FFD700" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}
