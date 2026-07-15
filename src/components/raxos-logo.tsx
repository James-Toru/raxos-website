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

function Wordmark({ className = "", fill }: { className?: string; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      <motion.g data-letter="R" variants={intro} transition={{ ...transition, delay: 0.02 }}>
        <path d="M12 20H150L184 48V72L158 95H105L184 130H132L74 104H50V130H12V65H142L154 55L142 44H12Z" />
      </motion.g>

      <motion.g data-letter="A" variants={intro} transition={{ ...transition, delay: 0.09 }}>
        <path
          d="M210 130L274 20H324L395 130H349L334 104H267L252 130ZM286 55L272 82H319L304 55Z"
          fillRule="evenodd"
        />
      </motion.g>

      <motion.g data-letter="X" variants={intro} transition={{ ...transition, delay: 0.16 }}>
        <path d="M415 20H466L518 58L570 20H621L550 74L625 130H572L518 91L465 130H412L486 74Z" />
      </motion.g>

      <motion.g data-letter="O" variants={intro} transition={{ ...transition, delay: 0.23 }}>
        <path
          d="M648 20H791L824 49V101L791 130H648L616 101V49ZM679 47L658 64V86L679 103H760L781 86V64L760 47Z"
          fillRule="evenodd"
        />
      </motion.g>

      <motion.g data-letter="S" variants={intro} transition={{ ...transition, delay: 0.3 }}>
        <path d="M852 20H1024V47H897L883 59H990L1024 83V106L997 130H826V103H955L968 92H858L826 68V45Z" />
      </motion.g>
    </g>
  );
}

function WordmarkFacets() {
  return (
    <g className="logo-facet" aria-hidden="true">
      <g data-letter="R">
        <path d="M12 20H150L166 33H28Z" />
      </g>
      <g data-letter="A">
        <path d="M274 20H324L333 34H266Z" />
      </g>
      <g data-letter="X">
        <path d="M415 20H466L478 29H427Z" />
        <path d="M570 20H621L609 29H558Z" />
      </g>
      <g data-letter="O">
        <path d="M648 20H791L807 34H632Z" />
      </g>
      <g data-letter="S">
        <path d="M852 20H1024V34H839Z" />
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
      viewBox="0 0 1040 150"
      preserveAspectRatio="xMidYMid meet"
      width="470"
      height="68"
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
        <pattern id="raxos-word-hex" width="20" height="17.3" patternUnits="userSpaceOnUse">
          <path
            d="M5 0.8H15L19.5 8.65L15 16.5H5L0.5 8.65Z"
            fill="none"
            stroke="rgba(66,0,5,0.68)"
            strokeWidth="0.85"
          />
        </pattern>
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
        <Wordmark className="logo-texture" fill="url(#raxos-word-hex)" />
      </motion.g>
    </motion.svg>
  );
}
