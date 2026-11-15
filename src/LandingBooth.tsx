type Props = { onEnter: () => void; onHelp: () => void }

export default function LandingBooth({ onEnter, onHelp }: Props) {
  return (
    <main className="landing-main">
      <div className="landing-topline"><span>사진 한 장이 카드 한 장이 되는 곳</span><button type="button" onClick={onHelp}>이용 방법 ↗</button></div>
      <div className="landing-illustration">
        <svg className="landing-drawing" viewBox="0 0 700 650" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M75 609Q321 605 633 609" strokeWidth="1.7" opacity=".35" />
            <path d="M169 44 543 50 555 136 164 130Z" fill="#fdfcf8" strokeWidth="3.5" />
            <path d="M179 54Q343 56 531 58L539 126 176 119Z" strokeWidth="1.7" />
            <path d="M217 135 216 158M502 137 503 158" strokeWidth="3" />
            <path d="M101 163 135 145 584 153 559 170Z" fill="#efeee9" strokeWidth="3" />
            <path d="M559 170 584 153 592 568 560 587Z" fill="#e9e7df" strokeWidth="3" />
            <path d="M101 163Q329 169 559 170L560 587Q322 583 101 579Z" fill="#fdfcf8" strokeWidth="3.6" />
            <path d="M106 183Q332 186 556 183M108 565Q310 571 554 571" strokeWidth="1.4" />
            <path d="M134 202 390 205 390 470 133 467Z" fill="#f1f0eb" strokeWidth="3" />
            <path d="M145 214Q264 216 378 214L378 452 145 452Z" strokeWidth="1.6" />
            <path d="M415 204Q477 206 537 207L537 470Q476 469 414 469Z" strokeWidth="2.2" />
            <path d="M429 222Q481 220 523 224M429 456Q471 458 522 455" strokeWidth="1.1" />
            <path d="M145 498Q260 495 378 501L378 526Q262 528 145 524Z" fill="#eeece5" strokeWidth="2.6" />
            <path d="M163 509Q260 511 360 509" strokeWidth="2" />
            <path d="M167 528 167 553 349 556 349 528" fill="#fff" strokeWidth="2.3" />
            <path d="M197 539Q254 541 320 540" strokeWidth="1" />
            <path d="M123 581 123 600 147 601 150 582M512 585 513 601 541 601 540 586" fill="#e5e4dd" strokeWidth="2" />
            <path d="M569 197 579 189M569 209 580 201M570 222 580 214M570 235 580 227M572 510 582 502M571 523 581 515M572 536 582 528" strokeWidth="1.3" opacity=".55" />
            <path d="M69 328Q43 299 65 281M55 290 66 280 68 296" strokeWidth="1.8" />
            <path d="M595 344Q626 328 631 302m-11 7 12-8 4 12" strokeWidth="1.8" />
          </g>
          <g transform="rotate(-8 209 334)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <rect x="162" y="256" width="94" height="154" rx="3" fill="#fffdfa" strokeWidth="2.2" />
            <rect x="170" y="264" width="78" height="108" fill="#dcded9" strokeWidth="1.4" />
            <circle cx="209" cy="301" r="16" strokeWidth="1.3" />
            <path d="M185 352Q187 326 209 326 233 326 234 352M178 389Q209 387 239 390" strokeWidth="1.4" />
          </g>
          <g transform="rotate(7 308 336)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <rect x="258" y="255" width="96" height="157" rx="3" fill="#fffdfa" strokeWidth="2.2" />
            <rect x="266" y="263" width="80" height="110" fill="#e8e3db" strokeWidth="1.4" />
            <path d="M269 349Q290 315 316 333 333 308 345 324" strokeWidth="1.6" />
            <circle cx="285" cy="289" r="7" strokeWidth="1.4" />
            <path d="M275 391Q310 388 340 391" strokeWidth="1.4" />
          </g>
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="475" cy="294" r="27" fill="#acd7b7" strokeWidth="2.6" />
            <circle cx="475" cy="294" r="18" strokeWidth="1.3" />
            <path d="M470 293 475 298 482 288" strokeWidth="2" />
            <path d="M441 366Q474 364 509 367L508 379 441 378Z" fill="#e9e7e0" strokeWidth="2.2" />
            <path d="M447 379 447 419 503 420 503 379" fill="#fffefa" strokeWidth="1.6" />
            <path d="M455 388 494 389 493 408 455 407Z" fill="#f4eee7" strokeWidth="1" />
            <path d="M448 431Q475 434 503 431" strokeWidth="1.1" />
            <path d="m122 246-7-10m24 1 2-12m234 12 8-9m-6 13 15-3" strokeWidth="1.6" />
          </g>
          <text x="351" y="103" fill="currentColor" textAnchor="middle" fontFamily="Gaegu, sans-serif" fontSize="52" letterSpacing="-2">나만의 카드깡!!</text>
          <text x="258" y="545" fill="currentColor" textAnchor="middle" fontFamily="SUIT Variable, sans-serif" fontSize="10" letterSpacing="2.6">PHOTO CARD MACHINE</text>
          <text x="467" y="246" fill="currentColor" textAnchor="middle" fontFamily="Gaegu, sans-serif" fontSize="26">꾹!</text>
          <text x="4" y="263" fill="currentColor" fontFamily="Gaegu, sans-serif" fontSize="25">사진을 넣고</text>
          <text x="580" y="287" fill="currentColor" fontFamily="Gaegu, sans-serif" fontSize="25">눌러요</text>
        </svg>
        <button className="landing-enter" type="button" onClick={onEnter}>부스 들어가기 <span aria-hidden="true">↗</span></button>
      </div>
      <p className="landing-caption">찍어도 좋고, 앨범에서 골라도 좋아요.</p>
      <footer className="landing-footer"><span>CARDS MADE BY YOU</span><span>사진은 이 기기에서만 사용해요.</span></footer>
    </main>
  )
}
