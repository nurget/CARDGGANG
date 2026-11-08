import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="카드깡 홈">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>카드깡</span>
        </a>
        <span className="header-note">사진으로 만드는 나만의 카드</span>
      </header>

      <section className="welcome" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="eyebrow">YOUR PHOTO, YOUR CARD</p>
          <h1 id="welcome-title">오늘의 사진을,<br />뽑고 싶은 카드로.</h1>
          <p className="intro">
            사진을 찍고 카드를 만든 다음,
            팩을 열어 나만의 순간을 만나보세요.
          </p>
          <div className="setup-status">
            <span className="status-dot" aria-hidden="true" />
            <span>포토부스를 준비하고 있어요</span>
          </div>
        </div>

        <div className="card-stack" aria-hidden="true">
          <div className="sample-card sample-card-back sample-card-blue" />
          <div className="sample-card sample-card-back sample-card-pink" />
          <div className="sample-card sample-card-front">
            <div className="card-topline"><span>NO. 001</span><span>✦</span></div>
            <div className="portrait-placeholder"><span>오늘의<br />주인공</span></div>
            <div className="card-caption">
              <span className="rarity">SPECIAL EDITION</span>
              <strong>나만의 순간</strong>
              <span className="card-subtitle">곧 카드가 되어 찾아올게요</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>사진은 내 기기에서 안전하게 다룰 예정이에요.</span>
        <span className="footer-sparkle" aria-hidden="true">✳</span>
      </footer>
    </main>
  )
}

export default App
