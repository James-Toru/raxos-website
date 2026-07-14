"use client";

import { motion } from "framer-motion";

const intro = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const transition = {
  duration: 0.72,
  ease: [0.22, 1, 0.36, 1] as const,
};

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <g className={className}>
      <motion.g variants={intro} transition={{ ...transition, delay: 0.02 }}>
        <path d="M42 36H181L199 53V75L183 91H123L199 136H145L91 101H76V136H42V68H150L159 60L150 52H42Z" />
        <path className="logo-void" d="M76 67H146L155 76L146 84H76Z" />
        <path className="logo-glint" d="M49 40H178L190 52H42Z" />
      </motion.g>

      <motion.g variants={intro} transition={{ ...transition, delay: 0.09 }}>
        <path d="M226 136L296 36H343L414 136H363L321 71L278 136Z" />
        <path className="logo-void" d="M302 98L321 67L341 98Z" />
        <path className="logo-glint" d="M298 36H342L357 58H284Z" />
      </motion.g>

      <motion.g variants={intro} transition={{ ...transition, delay: 0.16 }}>
        <path d="M452 36H506L551 75L596 36H650L582 86L654 136H598L551 98L506 136H450L522 86Z" />
        <path className="logo-void soft" d="M535 80L551 66L568 80L552 94Z" />
        <path className="logo-glint" d="M459 37H505L551 77L543 83Z" />
      </motion.g>

      <motion.g variants={intro} transition={{ ...transition, delay: 0.23 }}>
        <path d="M704 36H830L860 64V109L830 136H704L674 109V64Z" />
        <path className="logo-void" d="M727 62H807L817 72V101L807 111H727L717 101V72Z" />
        <path className="logo-glint" d="M711 40H825L846 60H688Z" />
      </motion.g>

      <motion.g variants={intro} transition={{ ...transition, delay: 0.3 }}>
        <path d="M918 36H1062V62H958L947 73H1034L1062 98V113L1036 136H884V110H995L1008 99H913L886 75V56Z" />
        <path className="logo-void soft" d="M949 62H1062V74H937Z" />
        <path className="logo-void soft" d="M884 99H1008L995 110H884Z" />
        <path className="logo-glint" d="M924 40H1055L1062 47H918Z" />
      </motion.g>
    </g>
  );
}

export function RaxosMark() {
  return (
    <motion.svg
      className="raxos-mark"
      viewBox="0 0 240 220"
      role="img"
      aria-label="Raxos emblem"
      initial="hidden"
      animate="show"
    >
      <defs>
        <linearGradient id="raxos-mark-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff2118" />
          <stop offset="16%" stopColor="#d90009" />
          <stop offset="56%" stopColor="#7d0007" />
          <stop offset="100%" stopColor="#210002" />
        </linearGradient>
        <linearGradient id="raxos-mark-side" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a0003" />
          <stop offset="54%" stopColor="#0f0001" />
          <stop offset="100%" stopColor="#070000" />
        </linearGradient>
        <filter id="raxos-mark-burn" x="-12%" y="-70%" width="124%" height="240%">
          <feGaussianBlur stdDeviation="5.8" result="blur" />
          <feColorMatrix
            in="blur"
            result="red"
            values="1 0 0 0 0.85 0 0 0 0 0.01 0 0 0 0 0.01 0 0 0 0.86 0"
          />
          <feMerge>
            <feMergeNode in="red" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g variants={intro} transition={transition} filter="url(#raxos-mark-burn)">
        <g fill="url(#raxos-mark-side)" transform="translate(9 10)">
          <path d="M38 28H156L202 72V105L173 132H87V192H38Z" />
          <path d="M87 119H154L207 192H148L87 142Z" />
        </g>
        <g fill="url(#raxos-mark-face)">
          <path d="M38 28H156L202 72V105L173 132H87V192H38Z" />
          <path d="M87 119H154L207 192H148L87 142Z" />
        </g>
        <path fill="#050000" d="M87 63H145L164 81V94L146 111H87Z" />
      </motion.g>
    </motion.svg>
  );
}

export function RaxosLogo() {
  return (
    <motion.svg
      className="raxos-logo"
      viewBox="0 0 1104 172"
      role="img"
      aria-label="Raxos"
      initial="hidden"
      animate="show"
    >
      <defs>
        <linearGradient id="raxos-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff2118" />
          <stop offset="16%" stopColor="#d90009" />
          <stop offset="56%" stopColor="#7d0007" />
          <stop offset="100%" stopColor="#210002" />
        </linearGradient>
        <linearGradient id="raxos-side" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a0003" />
          <stop offset="54%" stopColor="#0f0001" />
          <stop offset="100%" stopColor="#070000" />
        </linearGradient>
        <linearGradient id="raxos-highlight" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(255,210,180,0.28)" />
          <stop offset="36%" stopColor="rgba(255,42,30,0.12)" />
          <stop offset="100%" stopColor="rgba(255,145,110,0.18)" />
        </linearGradient>
        <filter id="raxos-burn" x="-12%" y="-70%" width="124%" height="240%">
          <feGaussianBlur stdDeviation="5.8" result="blur" />
          <feColorMatrix
            in="blur"
            result="red"
            values="1 0 0 0 0.85 0 0 0 0 0.01 0 0 0 0 0.01 0 0 0 0.86 0"
          />
          <feMerge>
            <feMergeNode in="red" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="raxos-grain" x="-2%" y="-8%" width="104%" height="116%">
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed="14" type="fractalNoise" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.13" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      <motion.g
        className="raxos-logo__word"
        filter="url(#raxos-burn)"
        transition={{ staggerChildren: 0.04 }}
      >
        <Wordmark className="logo-depth" />
        <Wordmark className="logo-face" />
        <Wordmark className="logo-ember" />
        <Wordmark className="logo-highlight" />
        <Wordmark className="logo-texture" />
      </motion.g>
    </motion.svg>
  );
}
