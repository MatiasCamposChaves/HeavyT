import cs from "./auth.module.css"

export default function Logo({ compact = false }) {
  const className = compact ? cs.formLogo : cs.logo

  return (
    <svg className={className} viewBox="0 0 180 150" role="img" aria-label="Heavy T">
      <defs>
        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#f5f5f5" />
          <stop offset="0.5" stopColor="#868c93" />
          <stop offset="1" stopColor="#f8f8f8" />
        </linearGradient>
      </defs>
      <path d="M90 7 150 31v78L90 141 30 109V31Z" fill="#1b1e24" stroke="#eef0f2" strokeWidth="6" />
      <path d="M90 16 141 36v68L90 130 39 104V36Z" fill="#171a20" stroke="#6d737a" strokeWidth="4" />
      <rect x="10" y="62" width="20" height="31" fill="url(#metal)" />
      <rect x="150" y="62" width="20" height="31" fill="url(#metal)" />
      <rect x="22" y="55" width="12" height="45" fill="#8c9299" />
      <rect x="146" y="55" width="12" height="45" fill="#8c9299" />
      <path d="M50 39h80l-7 23H103v51L90 121l-13-8V62H57Z" fill="#e3001b" />
      <path d="M66 62h11v49l-11-7Z" fill="#990015" />
      <path d="M103 62h11v42l-11 7Z" fill="#990015" />
      <path d="M50 39h80l-7 23H103v51L90 121l-13-8V62H57Z" fill="none" stroke="#75000f" strokeWidth="5" />
    </svg>
  )
}
