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
      <motion.g data-letter="R" variants={intro} transition={{ ...transition, delay: 0.02 }}>
        <path d="M38 39H176L199 60V83L178 102H121L199 137H145L88 110H75V137H38V78H151L161 69L151 60H38Z" />
      </motion.g>

      <motion.g data-letter="A" variants={intro} transition={{ ...transition, delay: 0.09 }}>
        <path
          d="M230 137L296 39H343L413 137H368L350 109H287L269 137ZM304 83H334L319 60Z"
          fillRule="evenodd"
        />
      </motion.g>

      <motion.g data-letter="X" variants={intro} transition={{ ...transition, delay: 0.16 }}>
        <path d="M450 39H502L550 75L598 39H650L580 87L654 137H601L550 101L500 137H447L520 87Z" />
      </motion.g>

      <motion.g data-letter="O" variants={intro} transition={{ ...transition, delay: 0.23 }}>
        <path
          d="M692 39H831L860 66V110L831 137H692L664 110V66ZM724 65L708 79V98L724 111H800L816 98V79L800 65Z"
          fillRule="evenodd"
        />
      </motion.g>

      <motion.g data-letter="S" variants={intro} transition={{ ...transition, delay: 0.3 }}>
        <path d="M905 39H1064V65H950L938 76H1029L1064 100V115L1039 137H879V111H995L1007 101H914L879 77V59Z" />
      </motion.g>
    </g>
  );
}

function WordmarkFacets() {
  return (
    <g className="logo-facet" aria-hidden="true">
      <g data-letter="R">
        <path d="M38 39H176L190 52H52Z" />
      </g>
      <g data-letter="A">
        <path d="M296 39H343L352 52H287Z" />
      </g>
      <g data-letter="X">
        <path d="M450 39H502L513 47H462Z" />
        <path d="M598 39H650L638 47H586Z" />
      </g>
      <g data-letter="O">
        <path d="M692 39H831L845 52H678Z" />
      </g>
      <g data-letter="S">
        <path d="M905 39H1064V52H892Z" />
      </g>
    </g>
  );
}

export function RaxosMark() {
  return (
    <motion.svg
      className="raxos-mark"
      viewBox="0 0 220 184"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Raxos emblem"
    >
      <defs>
        <linearGradient id="raxos-mark-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="28%" stopColor="#ff171d" />
          <stop offset="72%" stopColor="#cf000b" />
          <stop offset="100%" stopColor="#8b0007" />
        </linearGradient>
        <linearGradient id="raxos-mark-side" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a0003" />
          <stop offset="54%" stopColor="#0f0001" />
          <stop offset="100%" stopColor="#070000" />
        </linearGradient>
        <linearGradient id="raxos-mark-highlight" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,218,196,0.48)" />
          <stop offset="100%" stopColor="rgba(255,58,48,0.08)" />
        </linearGradient>
        <pattern id="raxos-mark-hex" width="18" height="15.6" patternUnits="userSpaceOnUse">
          <path
            d="M4.5 0.8H13.5L17.5 7.8L13.5 14.8H4.5L0.5 7.8Z"
            fill="none"
            stroke="rgba(61,0,4,0.72)"
            strokeWidth="0.9"
          />
        </pattern>
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
        <g className="mark-depth" fill="url(#raxos-mark-side)" transform="translate(4 5)">
          <path d="M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z" />
          <path d="M18 91H66L159 176H111Z" />
          <path d="M116 111H170L202 139V176Z" />
        </g>
        <g className="mark-face" fill="url(#raxos-mark-face)">
          <path d="M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z" />
          <path d="M18 91H66L159 176H111Z" />
          <path d="M116 111H170L202 139V176Z" />
        </g>
        <g className="mark-facet" fill="url(#raxos-mark-highlight)" aria-hidden="true">
          <path d="M18 18H163L180 33H35Z" />
          <path d="M180 33L202 53V82L180 72Z" />
          <path d="M18 91H66L82 106H34Z" />
        </g>
        <g className="mark-texture" fill="url(#raxos-mark-hex)" aria-hidden="true">
          <path d="M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z" />
          <path d="M18 91H66L159 176H111Z" />
          <path d="M116 111H170L202 139V176Z" />
        </g>
      </motion.g>
    </motion.svg>
  );
}

export function RaxosLogo() {
  return (
    <motion.svg
      className="raxos-logo"
      viewBox="38 39 1026 98"
      preserveAspectRatio="none"
      width="470"
      height="62"
      role="img"
      aria-label="Raxos"
    >
      <defs>
        <linearGradient id="raxos-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="28%" stopColor="#ff171d" />
          <stop offset="72%" stopColor="#cf000b" />
          <stop offset="100%" stopColor="#8b0007" />
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
        transition={{ staggerChildren: 0.04 }}
      >
        <Wordmark className="logo-depth" />
        <Wordmark className="logo-face" />
        <WordmarkFacets />
        <Wordmark className="logo-texture" />
      </motion.g>
    </motion.svg>
  );
}
