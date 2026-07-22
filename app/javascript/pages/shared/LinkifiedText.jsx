const urlPattern = /(https?:\/\/[^\s]+)/g
const startsWithUrl = /^https?:\/\//

export default function LinkifiedText({ text, className = "" }) {
  const parts = String(text || "").split(urlPattern)

  return (
    <p className={`${className} whitespace-pre-wrap`}>
      {parts.map((part, index) => (
        startsWithUrl.test(part) ? (
          <a
            className="break-all font-bold text-[#ff4056] underline decoration-[#ff4056]/60 underline-offset-2 hover:text-white"
            href={part}
            key={`${part}-${index}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {part}
            <i aria-hidden="true" className="bi bi-box-arrow-up-right ml-1 text-xs" />
          </a>
        ) : <span key={`${part}-${index}`}>{part}</span>
      ))}
    </p>
  )
}
