import { type ReactNode } from 'react'

// 참고 사이트의 에셋을 복제하지 않고, 카드 출력기를 직접 그린 선화.
export default function SketchBooth({ children }: { children: ReactNode }) {
  return (
    <div className="sketch-booth">
      <svg className="booth-drawing" viewBox="0 0 410 510" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M45 40 79 20 373 25 340 44" fill="#f1f1ee" />
          <path d="M340 44 373 25 377 455 341 481Z" fill="#e9e9e5" />
          <path d="M45 40Q193 43 340 44L341 481Q188 477 44 480Z" fill="#fafaf8" />
          <path d="M48 44 337 47M47 96Q191 99 339 97M47 101 338 102" />
          <path d="M68 106Q189 108 312 107L313 411Q190 414 68 411Z" fill="#20201e" />
          <path d="M74 112 307 113 307 407 73 405Z" fill="#efefec" />
          <path d="M102 437Q194 434 287 438L286 444 102 444Z" fill="#292926" />
          <path d="M106 450 281 451" opacity=".4" />
          <path d="M68 481 68 494 88 494 91 481M297 482 298 495 320 495 320 481" fill="#e2e2dc" />
          <path d="M352 65 363 57M352 75 364 67M352 85 363 77M352 95 364 87M352 105 363 97" opacity=".45" />
          <path d="M353 422 365 414M353 432 365 424M353 442 366 434" opacity=".45" />
          <path d="M281 64C278 48 304 47 306 64C310 81 281 83 281 64Z" fill="#e3e3de" />
          <circle cx="293" cy="64" r="7" fill="#20201e" />
          <path d="m289 60 4-1" stroke="white" />
          <path d="M28 500Q193 503 363 500" opacity=".35" />
          <path d="m322 9 4-8m10 14 8-6m-7 18 12-1" />
        </g>
        <text x="74" y="78" fontFamily="Gaegu, sans-serif" fontSize="33" fill="currentColor">카드깡!</text>
        <text x="193" y="467" textAnchor="middle" fontFamily="SUIT Variable, sans-serif" fontSize="7.5" letterSpacing="2" fill="currentColor">PHOTO CARD MACHINE</text>
      </svg>
      <div className="booth-viewfinder">{children}</div>
    </div>
  )
}
