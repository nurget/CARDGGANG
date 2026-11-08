import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const photoUrlRef = useRef<string | null>(null)
  const countdownRef = useRef<number | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [cardName, setCardName] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [message, setMessage] = useState('카메라를 켜거나 사진을 업로드하세요.')

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const stream = streamRef.current
    if (!cameraOn || !video || !stream) return
    video.srcObject = stream
    void video.play().catch(() => setMessage('카메라를 재생할 수 없습니다. 사진을 업로드해 주세요.'))
  }, [cameraOn])

  function setPhoto(url: string) {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    photoUrlRef.current = url
    setPhotoUrl(url)
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
  }

  async function startCamera() {
    setMessage('카메라에 연결하는 중입니다.')
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage('이 브라우저에서 카메라를 사용할 수 없습니다. 사진을 업로드해 주세요.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      setCameraOn(true)
      setMessage('카메라가 켜졌습니다.')
    } catch (error) {
      const denied = error instanceof DOMException && error.name === 'NotAllowedError'
      setMessage(denied ? '카메라 권한이 필요합니다. 사진을 업로드할 수도 있습니다.' : '카메라에 연결할 수 없습니다. 사진을 업로드해 주세요.')
    }
  }

  function capturePhoto() {
    const video = videoRef.current
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setMessage('카메라가 준비되면 촬영할 수 있습니다.')
      return
    }

    const width = 480
    const height = 600
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) {
      setMessage('사진을 만들지 못했습니다. 다시 촬영해 주세요.')
      return
    }

    const aspect = width / height
    const sourceAspect = video.videoWidth / video.videoHeight
    const cropWidth = sourceAspect > aspect ? video.videoHeight * aspect : video.videoWidth
    const cropHeight = sourceAspect > aspect ? video.videoHeight : video.videoWidth / aspect
    const cropX = (video.videoWidth - cropWidth) / 2
    const cropY = (video.videoHeight - cropHeight) / 2

    context.imageSmoothingEnabled = true
    context.translate(width, 0)
    context.scale(-1, 1)
    context.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height)
    canvas.toBlob((blob) => {
      if (!blob) {
        setMessage('사진을 저장하지 못했습니다. 다시 촬영해 주세요.')
        return
      }
      setPhoto(URL.createObjectURL(blob))
      stopCamera()
      setMessage('촬영한 사진을 미리보기에 적용했습니다.')
    }, 'image/jpeg', 0.9)
  }

  function startCountdown() {
    if (!cameraOn) {
      void startCamera()
      return
    }
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current)
    setCountdown(3)
    let seconds = 3
    countdownRef.current = window.setInterval(() => {
      seconds -= 1
      if (seconds <= 0) {
        if (countdownRef.current !== null) window.clearInterval(countdownRef.current)
        countdownRef.current = null
        setCountdown(null)
        capturePhoto()
        return
      }
      setCountdown(seconds)
    }, 700)
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('이미지 파일을 선택해 주세요.')
      return
    }
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current)
    countdownRef.current = null
    setCountdown(null)
    stopCamera()
    setPhoto(URL.createObjectURL(file))
    setMessage('선택한 사진을 미리보기에 적용했습니다.')
    event.currentTarget.value = ''
  }

  function retake() {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    photoUrlRef.current = null
    setPhotoUrl(null)
    setMessage('다시 촬영할 수 있습니다.')
    void startCamera()
  }

  return (
    <main className="studio-page">
      <header className="studio-header">
        <a className="brand" href="/" aria-label="카드깡 홈">
          <span className="brand-symbol" aria-hidden="true">gg.</span>
          <span>카드깡</span>
        </a>
        <div className="header-center"><span className="privacy-dot" /> 사진은 브라우저에서 처리됩니다</div>
        <div className="header-step">PHOTO CARD <span>01</span></div>
      </header>

      <section className="studio-layout" aria-label="포토카드 촬영">
        <div className="capture-column">
          <div className="capture-heading">
            <div>
              <p className="eyebrow">CARDGGANG · PHOTO CARD</p>
              <h1>포토카드 만들기</h1>
            </div>
          </div>

          <div className={`camera-stage ${photoUrl ? 'has-photo' : ''}`}>
            <div className="stage-label"><span>LIVE VIEW</span><span>{cameraOn ? '● 카메라 켜짐' : photoUrl ? '사진 준비 완료' : '카메라 대기 중'}</span></div>
            {cameraOn && !photoUrl && <video ref={videoRef} className="camera-media" autoPlay muted playsInline aria-label="웹캠 미리보기" />}
            {photoUrl && <img className="camera-media" src={photoUrl} alt="포토카드에 사용할 사진" />}
            {!cameraOn && !photoUrl && (
              <div className="booth-illustration" aria-hidden="true">
                <svg viewBox="0 0 240 260" role="presentation">
                  <path d="M47 239V86c0-37 27-66 67-66h12c40 0 67 29 67 66v153" />
                  <path d="M36 239h169M59 91c0-29 22-51 54-51h15c31 0 53 22 53 51v132H59z" />
                  <path d="M82 95c0-20 13-35 33-35h11c20 0 33 15 33 35v111H82z" />
                  <path d="M93 103c10 9 20 9 30 0s20-9 30 0M93 119c10 9 20 9 30 0s20-9 30 0M93 135c10 9 20 9 30 0s20-9 30 0M93 151c10 9 20 9 30 0s20-9 30 0" />
                  <path d="M103 208v17m42-17v17M100 225h49" />
                  <path d="M91 234c0 6 6 10 14 10h34c8 0 14-4 14-10" />
                  <path d="M105 80h35m-18-17v35" />
                </svg>
                <span>카메라를 켜면 화면이 여기에 표시됩니다</span>
              </div>
            )}
            <div className="stage-corner corner-one" />
            <div className="stage-corner corner-two" />
            <div className="stage-corner corner-three" />
            <div className="stage-corner corner-four" />
            {countdown !== null && <div className="countdown" role="status">{countdown}</div>}
            {photoUrl && <span className="photo-caption">방금 찍은 나</span>}
          </div>

          <div className="capture-controls">
            <div className="capture-message" role="status">{message}</div>
            <div className="capture-buttons">
              {!cameraOn && !photoUrl && <button className="secondary-button" type="button" onClick={() => void startCamera()}>카메라 켜기</button>}
              {cameraOn && <button className="snap-button" type="button" onClick={startCountdown}><span className="snap-icon" /> 촬영</button>}
              {photoUrl && <button className="secondary-button" type="button" onClick={retake}>다시 촬영</button>}
              <label className="upload-button">
                사진 업로드
                <input type="file" accept="image/*" onChange={handleUpload} />
              </label>
              {cameraOn && <button className="camera-stop" type="button" onClick={stopCamera}>카메라 끄기</button>}
            </div>
          </div>
        </div>

        <aside className="card-column" aria-label="포토카드 미리보기">
          <div className="preview-heading"><span>카드 미리보기</span><span className="preview-count">GG · 001</span></div>
          <article className="trading-card">
            <div className="card-topline"><span>카드깡</span><span>001</span></div>
            <div className="card-picture">
              {photoUrl ? <img src={photoUrl} alt="카드에 들어갈 사진" /> : (
                <div className="card-placeholder">
                  <span className="placeholder-cross" aria-hidden="true">＋</span>
                  <span>사진 미리보기</span>
                </div>
              )}
            </div>
            <div className="card-info">
              <span className="card-edition">PHOTO CARD · 001</span>
              <strong>{cardName.trim() || '이름'}</strong>
              <div className="card-rule" />
              <span className="card-caption">CARDGGANG COLLECTION</span>
            </div>
          </article>

          <label className="name-field">
            <span>이름</span>
            <input
              maxLength={18}
              onChange={(event) => setCardName(event.currentTarget.value)}
              placeholder="카드에 표시할 이름"
              value={cardName}
            />
          </label>
          <div className="preview-footnote">사진과 이름이 카드에 반영됩니다.</div>
        </aside>
      </section>

      <footer className="studio-footer"><span>카드깡</span><span>촬영 이미지는 이 브라우저에 임시 보관됩니다.</span></footer>
    </main>
  )
}

export default App
