import type { CSSProperties } from "react";

/** Original brand illustrations. These are artwork, not photographs: replace via Admin > Media when real photos exist. */

export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "#211A16" : "#FFF7E8";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="26" r="13" fill="#F4B900" />
        <path d="M11 26a13 13 0 0 1 26 0z" fill="#FF4D00" />
        {[...Array(7)].map((_, i) => {
          const a = (Math.PI * (i + 0.5)) / 7 + Math.PI;
          return <line key={i} x1={24 + Math.cos(a) * 17} y1={26 + Math.sin(a) * 17} x2={24 + Math.cos(a) * 22} y2={26 + Math.sin(a) * 22} stroke="#FF4D00" strokeWidth="3" strokeLinecap="round" />;
        })}
        <rect x="4" y="38" width="40" height="4" rx="2" fill={text} />
      </svg>
      <span className="leading-none">
        <span className="display-lg block text-[1.35rem]" style={{ color: text }}>Rise N’ Shine</span>
        <span className="block text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: text }}>Breakfast Place</span>
      </span>
    </span>
  );
}

export function SunArcs({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 800 400" className={className} style={style} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <circle cx="400" cy="400" r="390" fill="#F52B0A" opacity=".55" />
      <circle cx="400" cy="400" r="310" fill="#FF7A1A" opacity=".8" />
      <circle cx="400" cy="400" r="230" fill="#F4B900" />
      <circle cx="400" cy="400" r="150" fill="#FFD84D" />
    </svg>
  );
}

export function HeroPlate({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Illustration of a breakfast plate: beef tapa, garlic rice, a sunny egg and mango salsa">
      <defs>
        <radialGradient id="yolk" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FFD23F" /><stop offset="1" stopColor="#F08A00" /></radialGradient>
        <linearGradient id="tapa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9C3B14" /><stop offset="1" stopColor="#5E200A" /></linearGradient>
      </defs>
      <ellipse cx="300" cy="545" rx="240" ry="26" fill="#211A16" opacity=".22" />
      <circle cx="300" cy="290" r="272" fill="#FFF7E8" />
      <circle cx="300" cy="290" r="272" fill="none" stroke="#F4B900" strokeWidth="10" />
      <circle cx="300" cy="290" r="214" fill="#fff" stroke="#F6E7C9" strokeWidth="6" />
      {/* garlic rice */}
      <g>
        <ellipse cx="205" cy="345" rx="86" ry="62" fill="#F7EBC8" />
        <ellipse cx="200" cy="330" rx="72" ry="48" fill="#FFF8DD" />
        {[[165,320],[190,300],[215,315],[235,335],[180,345],[210,352],[150,345],[228,300],[198,325],[170,300]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="4" fill="#fff" stroke="#EAD9A6" strokeWidth="1.2" transform={`rotate(${i * 37} ${x} ${y})`} />
        ))}
        {[[185,310],[222,326],[160,336]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#C99A2E" />)}
      </g>
      {/* beef tapa */}
      <g>
        {[[330,185,-18],[360,225,-8],[335,265,-22]].map(([x, y, r], i) => (
          <g key={i} transform={`rotate(${r} ${x} ${y})`}>
            <rect x={x - 90} y={y - 24} width="180" height="48" rx="24" fill="url(#tapa)" />
            <path d={`M${x - 70} ${y - 8}q40 -14 90 0`} stroke="#D2753C" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".7" />
            <circle cx={x + 40} cy={y + 8} r="4" fill="#D2753C" opacity=".55" />
          </g>
        ))}
      </g>
      {/* fried egg */}
      <g>
        <path d="M335 345c-40 8-62 44-40 78 18 28 62 36 98 24 44-14 52-62 22-86-26-20-52-24-80-16z" fill="#fff" stroke="#EFE3C8" strokeWidth="4" />
        <circle cx="362" cy="392" r="30" fill="url(#yolk)" />
        <ellipse cx="352" cy="382" rx="9" ry="6" fill="#FFF3B0" opacity=".85" />
      </g>
      {/* mango salsa */}
      <g>
        {[[270,420,0],[288,432,20],[256,440,45],[300,415,10],[278,452,30],[246,420,60]].map(([x, y, r], i) => (
          <rect key={i} x={x} y={y} width="14" height="14" rx="3" fill={i % 2 ? "#FFB020" : "#FF8A00"} transform={`rotate(${r} ${x} ${y})`} />
        ))}
        {[[262,430],[292,440],[272,418]].map(([x, y], i) => <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="#3E9B4F" />)}
      </g>
      {/* scallion flecks */}
      {[[420,300],[300,170],[250,250],[395,330],[345,325]].map(([x, y], i) => <rect key={i} x={x} y={y} width="16" height="4" rx="2" fill="#4FA85A" transform={`rotate(${i * 50} ${x} ${y})`} />)}
    </svg>
  );
}

const PALETTE = [
  ["#FFE9B8", "#FF4D00"], ["#FFD9C2", "#F52B0A"], ["#FFF1C4", "#E09B00"], ["#FBE3D3", "#C93A00"],
];

function hashOf(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function DishArt({ name, className = "" }: { name: string; className?: string }) {
  const [bg, ac] = PALETTE[hashOf(name) % PALETTE.length];
  const n = name.toLowerCase();
  const kind = /pancake/.test(n) ? "stack" : /waffle/.test(n) ? "waffle" : /toast/.test(n) ? "toast" : /omelet/.test(n) ? "omelette" : "egg";
  const toastColor = /ube/.test(n) ? "#9B6FD6" : "#E8B86A";
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={bg} />
      <circle cx="320" cy="60" r="90" fill={ac} opacity=".16" />
      <circle cx="60" cy="270" r="70" fill={ac} opacity=".12" />
      <ellipse cx="200" cy="262" rx="130" ry="14" fill="#211A16" opacity=".14" />
      <circle cx="200" cy="150" r="118" fill="#FFF7E8" stroke={ac} strokeWidth="6" />
      <circle cx="200" cy="150" r="92" fill="#fff" stroke="#F6E7C9" strokeWidth="4" />
      {kind === "stack" && (
        <g>
          {[0, 1, 2].map((i) => <ellipse key={i} cx="200" cy={170 - i * 20} rx="62" ry="17" fill={i === 2 ? "#E9A94E" : "#F2C67A"} stroke="#C98A32" strokeWidth="2" />)}
          <path d="M165 112c20-14 60-14 70 0 6 12-8 22-18 14-8 12-28 10-30 0-14 4-30-4-22-14z" fill={/buko|pandan/.test(n) ? "#9BCB6B" : "#5A2E16"} />
        </g>
      )}
      {kind === "waffle" && (
        <g>
          <rect x="140" y="100" width="120" height="100" rx="22" fill="#E9A94E" stroke="#C98A32" strokeWidth="3" />
          {[0, 1, 2].map((i) => <line key={"a" + i} x1={160 + i * 40} y1="106" x2={160 + i * 40} y2="194" stroke="#C98A32" strokeWidth="3" />)}
          {[0, 1].map((i) => <line key={"b" + i} x1="146" y1={133 + i * 33} x2="254" y2={133 + i * 33} stroke="#C98A32" strokeWidth="3" />)}
          <circle cx="200" cy="150" r="22" fill="#FFF3D6" opacity=".95" />
        </g>
      )}
      {kind === "toast" && (
        <g>
          <rect x="130" y="108" width="140" height="84" rx="20" fill={toastColor} stroke="#6E4AA6" strokeWidth="2" opacity=".95" />
          <rect x="146" y="122" width="108" height="56" rx="14" fill="#FFF7E8" opacity=".85" />
          <path d="M150 128q50 28 100 0" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}
      {kind === "omelette" && (
        <g>
          <path d="M120 160c0-44 40-62 80-62s80 18 80 62c0 22-40 30-80 30s-80-8-80-30z" fill="#FFD04D" stroke="#E0A200" strokeWidth="3" />
          {[[160,150],[200,138],[236,156],[182,168]].map(([x, y], i) => <rect key={i} x={x} y={y} width="12" height="12" rx="3" fill={["#E3472E","#4FA85A","#C98A32","#FFF"][i]} />)}
        </g>
      )}
      {kind === "egg" && (
        <g>
          <path d="M150 140c-6-30 30-44 56-34 30 10 40 44 14 62-24 16-62 6-70-28z" fill="#fff" stroke="#EFE3C8" strokeWidth="3" />
          <circle cx="196" cy="140" r="22" fill="#F5A300" />
          <ellipse cx="190" cy="133" rx="7" ry="4" fill="#FFF3B0" />
          <rect x="226" y="120" width="50" height="22" rx="11" fill="#7A2E12" transform="rotate(-18 250 130)" />
          <rect x="222" y="148" width="54" height="22" rx="11" fill="#9C3B14" transform="rotate(-6 250 160)" />
        </g>
      )}
    </svg>
  );
}
