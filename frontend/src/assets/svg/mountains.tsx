export const MountainsBg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="mist" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" seed="1" />
        <feDisplacementMap in="SourceGraphic" scale="20" />
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="ink-wash" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" />
        <feDisplacementMap in="SourceGraphic" scale="8" />
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5f0e8" />
        <stop offset="40%" stopColor="#ede4d3" />
        <stop offset="100%" stopColor="#e8dcc8" />
      </linearGradient>
      <linearGradient id="mountain-far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c8bfb0" />
        <stop offset="100%" stopColor="#d8d0c0" />
      </linearGradient>
      <linearGradient id="mountain-mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a09888" />
        <stop offset="100%" stopColor="#b8b0a0" />
      </linearGradient>
      <linearGradient id="mountain-near" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6a6258" />
        <stop offset="100%" stopColor="#8a8278" />
      </linearGradient>
      <linearGradient id="mist-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5f0e8" stopOpacity="0" />
        <stop offset="50%" stopColor="#f5f0e8" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#f5f0e8" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    
    {/* 天空 */}
    <rect width="1440" height="900" fill="url(#sky)" />
    
    {/* 远山 - 最淡 */}
    <g filter="url(#mist)" opacity="0.4">
      <path d="M0,500 Q180,350 360,420 Q540,300 720,380 Q900,280 1080,350 Q1260,300 1440,380 L1440,900 L0,900 Z" fill="url(#mountain-far)" />
    </g>
    
    {/* 远山云雾 */}
    <g opacity="0.3">
      <ellipse cx="300" cy="420" rx="200" ry="30" fill="#f5f0e8" filter="url(#mist)" />
      <ellipse cx="800" cy="380" rx="250" ry="25" fill="#f5f0e8" filter="url(#mist)" />
      <ellipse cx="1200" cy="350" rx="180" ry="28" fill="#f5f0e8" filter="url(#mist)" />
    </g>
    
    {/* 中山 */}
    <g filter="url(#ink-wash)" opacity="0.55">
      <path d="M-50,550 Q150,400 350,480 Q500,380 680,450 Q850,350 1050,420 Q1200,370 1350,430 Q1400,410 1500,450 L1500,900 L-50,900 Z" fill="url(#mountain-mid)" />
    </g>
    
    {/* 中山细节 - 松树剪影 */}
    <g opacity="0.25" transform="translate(200,430) scale(0.3)">
      <path d="M0,0 Q-5,-20 -15,-15 Q-5,-25 0,-40 Q5,-25 15,-15 Q5,-20 0,0" fill="#4a4a4a" />
      <path d="M0,-40 Q-8,-30 -18,-35 Q-8,-45 0,-60 Q8,-45 18,-35 Q8,-30 0,-40" fill="#4a4a4a" />
      <line x1="0" y1="0" x2="0" y2="80" stroke="#3a3a3a" strokeWidth="3" />
    </g>
    <g opacity="0.2" transform="translate(1100,400) scale(0.25)">
      <path d="M0,0 Q-5,-20 -15,-15 Q-5,-25 0,-40 Q5,-25 15,-15 Q5,-20 0,0" fill="#4a4a4a" />
      <path d="M0,-40 Q-8,-30 -18,-35 Q-8,-45 0,-60 Q8,-45 18,-35 Q8,-30 0,-40" fill="#4a4a4a" />
      <line x1="0" y1="0" x2="0" y2="80" stroke="#3a3a3a" strokeWidth="3" />
    </g>
    
    {/* 中山云雾 */}
    <g opacity="0.4">
      <ellipse cx="500" cy="470" rx="300" ry="35" fill="#f5f0e8" filter="url(#mist)" />
      <ellipse cx="1000" cy="440" rx="250" ry="30" fill="#f5f0e8" filter="url(#mist)" />
    </g>
    
    {/* 近山 */}
    <g filter="url(#ink-wash)" opacity="0.7">
      <path d="M-100,650 Q100,500 300,580 Q450,480 650,550 Q800,460 1000,520 Q1150,470 1300,530 Q1400,500 1550,550 L1550,900 L-100,900 Z" fill="url(#mountain-near)" />
    </g>
    
    {/* 近山松树 */}
    <g opacity="0.35" transform="translate(100,560) scale(0.5)">
      <path d="M0,0 Q-8,-30 -20,-20 Q-8,-40 0,-60 Q8,-40 20,-20 Q8,-30 0,0" fill="#3a3a3a" />
      <path d="M0,-60 Q-10,-45 -22,-55 Q-10,-70 0,-90 Q10,-70 22,-55 Q10,-45 0,-60" fill="#3a3a3a" />
      <path d="M0,-90 Q-8,-75 -18,-85 Q-8,-100 0,-115 Q8,-100 18,-85 Q8,-75 0,-90" fill="#3a3a3a" />
      <line x1="0" y1="0" x2="0" y2="120" stroke="#2a2a2a" strokeWidth="4" />
    </g>
    <g opacity="0.3" transform="translate(1350,540) scale(0.4)">
      <path d="M0,0 Q-6,-25 -18,-18 Q-6,-35 0,-50 Q6,-35 18,-18 Q6,-25 0,0" fill="#3a3a3a" />
      <path d="M0,-50 Q-8,-38 -20,-48 Q-8,-60 0,-75 Q8,-60 20,-48 Q8,-38 0,-50" fill="#3a3a3a" />
      <line x1="0" y1="0" x2="0" y2="100" stroke="#2a2a2a" strokeWidth="3" />
    </g>
    
    {/* 近处云雾 */}
    <g opacity="0.5">
      <ellipse cx="200" cy="620" rx="350" ry="40" fill="#f5f0e8" filter="url(#mist)" />
      <ellipse cx="900" cy="580" rx="400" ry="35" fill="#f5f0e8" filter="url(#mist)" />
    </g>
    
    {/* 底部渐变 - 留白 */}
    <rect x="0" y="700" width="1440" height="200" fill="url(#mist-grad)" />
    
    {/* 装饰性墨点 */}
    <g opacity="0.08">
      <circle cx="200" cy="300" r="3" fill="#2a2a2a" />
      <circle cx="600" cy="250" r="2" fill="#2a2a2a" />
      <circle cx="1000" cy="280" r="4" fill="#2a2a2a" />
      <circle cx="1300" cy="320" r="2.5" fill="#2a2a2a" />
    </g>
  </svg>
);

export const CloudPattern = ({ className = '' }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" preserveAspectRatio="none">
    <defs>
      <filter id="cloud-blur">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    <g opacity="0.15" filter="url(#cloud-blur)">
      <ellipse cx="50" cy="30" rx="40" ry="15" fill="#8a8278" />
      <ellipse cx="100" cy="25" rx="50" ry="18" fill="#8a8278" />
      <ellipse cx="150" cy="30" rx="40" ry="15" fill="#8a8278" />
    </g>
  </svg>
);

export const PineTree = ({ className = '', scale = 1 }: { className?: string; scale?: number }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160" transform={`scale(${scale})`}>
    <g opacity="0.6">
      {/* 树干 */}
      <path d="M48,160 L48,80 Q46,70 44,65 L48,65 L52,65 Q54,70 52,80 L52,160" fill="#3a3a3a" />
      {/* 树枝 */}
      <path d="M48,100 Q30,90 20,95 Q35,85 48,90" fill="#2a2a2a" />
      <path d="M52,100 Q70,90 80,95 Q65,85 52,90" fill="#2a2a2a" />
      {/* 树叶 */}
      <path d="M50,20 Q30,35 25,50 Q40,40 50,30 Q60,40 75,50 Q70,35 50,20" fill="#3a3a3a" />
      <path d="M50,40 Q35,50 30,65 Q42,55 50,48 Q58,55 70,65 Q65,50 50,40" fill="#3a3a3a" />
      <path d="M50,55 Q38,62 35,75 Q45,68 50,62 Q55,68 65,75 Q62,62 50,55" fill="#3a3a3a" />
    </g>
  </svg>
);

export const BambooBorder = ({ className = '', vertical = false }: { className?: string; vertical?: boolean }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox={vertical ? "0 0 20 100" : "0 0 100 20"} 
    preserveAspectRatio="none"
    style={vertical ? { height: '100%', width: '20px' } : { width: '100%', height: '20px' }}
  >
    <defs>
      <pattern id="bamboo" x="0" y="0" width={vertical ? "20" : "40"} height={vertical ? "40" : "20"} patternUnits="userSpaceOnUse">
        {/* 竹节 */}
        <rect x={vertical ? "8" : "0"} y={vertical ? "0" : "8"} width={vertical ? "4" : "40"} height={vertical ? "40" : "4"} fill="none" stroke="#6a6258" strokeWidth="1" />
        {/* 竹节结 */}
        <line x1={vertical ? "6" : "0"} y1={vertical ? "20" : "6"} x2={vertical ? "14" : "40"} y2={vertical ? "20" : "6"} stroke="#6a6258" strokeWidth="1.5" />
        <line x1={vertical ? "6" : "0"} y1={vertical ? "20" : "14"} x2={vertical ? "14" : "40"} y2={vertical ? "20" : "14"} stroke="#6a6258" strokeWidth="1.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bamboo)" opacity="0.3" />
  </svg>
);

export const CloudBorder = ({ className = '' }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 30" preserveAspectRatio="none">
    <defs>
      <pattern id="cloud-wave" x="0" y="0" width="80" height="30" patternUnits="userSpaceOnUse">
        <path d="M0,15 Q10,5 20,15 Q30,25 40,15 Q50,5 60,15 Q70,25 80,15" fill="none" stroke="#8a8278" strokeWidth="1" opacity="0.4" />
        <path d="M0,15 Q10,8 20,15 Q30,22 40,15 Q50,8 60,15 Q70,22 80,15" fill="none" stroke="#8a8278" strokeWidth="0.5" opacity="0.3" />
      </pattern>
    </defs>
    <rect width="400" height="30" fill="url(#cloud-wave)" />
  </svg>
);

export const InkSplash = ({ className = '' }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <filter id="ink-spread">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="5" />
        <feDisplacementMap in="SourceGraphic" scale="15" />
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    <g filter="url(#ink-spread)" opacity="0.15">
      <circle cx="50" cy="50" r="30" fill="#2a2a2a" />
      <circle cx="35" cy="40" r="15" fill="#2a2a2a" />
      <circle cx="65" cy="60" r="12" fill="#2a2a2a" />
    </g>
  </svg>
);

export const SealStamp = ({ text = "仙", className = '' }: { text?: string; className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <filter id="seal-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" seed="8" />
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
    </defs>
    <g filter="url(#seal-rough)">
      <rect x="5" y="5" width="50" height="50" rx="3" fill="none" stroke="#8b2500" strokeWidth="3" />
      <rect x="8" y="8" width="44" height="44" rx="2" fill="none" stroke="#8b2500" strokeWidth="1" opacity="0.5" />
      <text x="30" y="42" textAnchor="middle" fontFamily="serif" fontSize="28" fontWeight="bold" fill="#8b2500">
        {text}
      </text>
    </g>
  </svg>
);

export const GoldLeafDot = ({ className = '' }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <defs>
      <radialGradient id="gold-leaf">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="50%" stopColor="#b8860b" />
        <stop offset="100%" stopColor="#8b6914" />
      </radialGradient>
    </defs>
    <circle cx="10" cy="10" r="8" fill="url(#gold-leaf)" opacity="0.8" />
    <circle cx="10" cy="10" r="5" fill="#d4a574" opacity="0.4" />
  </svg>
);
