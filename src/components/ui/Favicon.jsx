// components/Favicon.jsx
const Favicon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7F1D1D"/>
          <stop offset="0.5" stopColor="#EC4899"/>
          <stop offset="1" stopColor="#F59E0B"/>
        </linearGradient>
      </defs>
      <g transform="translate(50 50)">
        <path 
          d="M -15,-25 L 15,-25 L 0,25 Z" 
          fill="url(#grad)" 
          stroke="#FFFFFF" 
          strokeWidth="2"
        />
        <path 
          d="M -30,0 Q -40,-15 -25,-15 Q -10,-15 -15,0 Z" 
          fill="url(#grad)" 
          opacity="0.8" 
          transform="rotate(-10)"
        />
        <path 
          d="M 30,0 Q 40,-15 25,-15 Q 10,-15 15,0 Z" 
          fill="url(#grad)" 
          opacity="0.8" 
          transform="rotate(10)"
        />
        <line x1="-5" y1="10" x2="5" y2="10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
  
  export default Favicon;