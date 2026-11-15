import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { canvasBlob, DEFAULT_CROP, type Crop, type Frame } from './card'
import PhotoPreview from './PhotoPreview'
import SketchBooth from './SketchBooth'
import LandingBooth from './LandingBooth'
import './App.css'

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" style={down ? { transform: 'rotate(90deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const photoUrlRef = useRef<string | null>(null)
  const downloadUrlRef = useRef<string | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cameraRequestRef = useRef(0)
  const photoRequestRef = useRef(0)
  const mountedRef = useRef(true)
  const helpRef = useRef<HTMLDialogElement>(null)
  const previewRef = useRef<HTMLDialogElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [camera, setCamera] = useState<'off' | 'loading' | 'on'>('off')
  const [cameraReady, setCameraReady] = useState(false)
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [cardName, setCardName] = useState('')
  const [cardNote, setCardNote] = useState('')
  const [frame, setFrame] = useState<Frame>('paper')
  const [crop, setCrop] = useState<Crop>(DEFAULT_CROP)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'photo' | 'card'>('photo')
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cameraRequestRef.current += 1
      photoRequestRef.current += 1
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  useEffect(() => {
    if (camera !== 'on' || !videoRef.current || !streamRef.current) return
    const video = videoRef.current
    const stream = streamRef.current
    video.srcObject = stream
    void video.play().catch(() => {
      if (mountedRef.current && streamRef.current === stream) {
        stopCamera()
        setMessage('카메라를 재생하지 못했습니다. 사진 불러오기를 이용해 주세요.')
      }
    })
  }, [camera])

  function stopCamera() {
    cameraRequestRef.current += 1
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = null
    setCountdown(null)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraReady(false)
    setCamera('off')
  }

  async function startCamera() {
    if (camera !== 'off') return
    setMessage('')
    setTab('photo')
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage('카메라를 지원하지 않는 환경입니다. 사진 불러오기를 이용해 주세요.')
      return
    }
    const request = ++cameraRequestRef.current
    setCamera('loading')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } } })
      if (!mountedRef.current || cameraRequestRef.current !== request) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      setCamera('on')
    } catch (error) {
      if (!mountedRef.current || cameraRequestRef.current !== request) return
      setCamera('off')
      const denied = error instanceof DOMException && error.name === 'NotAllowedError'
      setMessage(denied ? '카메라 권한을 허용하거나 사진 불러오기를 이용해 주세요.' : '카메라에 연결하지 못했습니다. 사진 불러오기를 이용해 주세요.')
    }
  }

  async function loadPhoto(blob: Blob) {
    if (!mountedRef.current) return
    const request = ++photoRequestRef.current
    setBusy(true)
    setMessage('')
    const originalUrl = URL.createObjectURL(blob)
    let nextUrl: string | null = null
    try {
      const original = new Image()
      original.src = originalUrl
      await original.decode()
      // 큰 업로드는 한 번 축소하고, 구도 편집은 원본 비율을 보존한 이미지에 적용한다.
      const scale = Math.min(1, 2048 / Math.max(original.naturalWidth, original.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(original.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(original.naturalHeight * scale))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('사진을 읽을 수 없습니다.')
      context.drawImage(original, 0, 0, canvas.width, canvas.height)
      nextUrl = URL.createObjectURL(await canvasBlob(canvas))
      const image = new Image()
      image.src = nextUrl
      await image.decode()
      if (!mountedRef.current || request !== photoRequestRef.current) return
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
      photoUrlRef.current = nextUrl
      nextUrl = null
      setPhoto(image)
      setCrop(DEFAULT_CROP)
      setTab('card')
      setMessage('사진을 적용했습니다. 구도는 ‘사진 위치’에서 바꿀 수 있어요.')
    } catch {
      if (mountedRef.current && request === photoRequestRef.current) setMessage('사진을 읽지 못했습니다. JPG, PNG 또는 WebP 파일을 선택해 주세요.')
    } finally {
      URL.revokeObjectURL(originalUrl)
      if (nextUrl) URL.revokeObjectURL(nextUrl)
      if (mountedRef.current && request === photoRequestRef.current) setBusy(false)
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setMessage('이미지 파일을 선택해 주세요.'); return }
    if (file.size > 25 * 1024 * 1024) { setMessage('25MB 이하의 사진을 선택해 주세요.'); return }
    stopCamera()
    await loadPhoto(file)
  }

  async function capturePhoto() {
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight) { setMessage('카메라가 준비되면 다시 촬영해 주세요.'); return }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) { setMessage('촬영하지 못했습니다. 다시 시도해 주세요.'); return }
    // 미리보기와 동일하게 한 번만 좌우 반전하고, 4:5 자르기는 공통 렌더러에 맡긴다.
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0)
    setBusy(true)
    // 캔버스가 프레임을 확보한 뒤에 스트림과 비디오를 해제한다.
    try {
      const blob = await canvasBlob(canvas)
      if (!mountedRef.current) return
      stopCamera()
      await loadPhoto(blob)
    }
    catch {
      if (mountedRef.current) { setBusy(false); setMessage('촬영하지 못했습니다. 다시 시도해 주세요.') }
    }
  }

  function startCountdown() {
    if (!cameraReady || countdownRef.current || busy) return
    setMessage('')
    let seconds = 3
    setCountdown(seconds)
    countdownRef.current = setInterval(() => {
      seconds -= 1
      if (seconds === 0) {
        if (countdownRef.current) clearInterval(countdownRef.current)
        countdownRef.current = null
        setCountdown(null)
        void capturePhoto()
      } else setCountdown(seconds)
    }, 1000)
  }

  async function saveCard() {
    if (!photo || saving) return
    setSaving(true)
    setMessage('')
    try {
      await document.fonts.ready
      // 화면의 캔버스 자체를 저장해 글꼴 렌더링까지 미리보기와 일치시킨다.
      const canvas = cardCanvasRef.current
      if (!canvas) throw new Error('카드가 아직 준비되지 않았습니다.')
      const blob = await canvasBlob(canvas)
      if (!mountedRef.current) return
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
      const url = URL.createObjectURL(blob)
      downloadUrlRef.current = url
      const link = document.createElement('a')
      link.href = url
      link.download = `나만의 카드깡!!-${cardName.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 24) || '포토카드'}.png`
      document.body.append(link)
      link.click()
      link.remove()
      setMessage('카드 PNG를 내려받았습니다.')
    } catch { if (mountedRef.current) setMessage('저장하지 못했습니다. 다시 시도해 주세요.') }
    finally { if (mountedRef.current) setSaving(false) }
  }

  function changeTab(next: 'photo' | 'card') {
    setTab(next)
    if (next === 'card' && camera !== 'off') stopCamera()
  }

  return (
    <div className={entered ? 'studio-page' : 'landing-page'}>
      {!entered && <LandingBooth onEnter={() => { setTab('photo'); setEntered(true) }} onHelp={() => helpRef.current?.showModal()} />}
      {entered && <>
      <header className="studio-header">
        <div className="wordmark" aria-label="나만의 카드깡!!">
          <svg width="31" height="36" viewBox="0 0 31 36" fill="none" aria-hidden="true"><path d="m7 3 21 2-2 29-21-2Z" stroke="currentColor" strokeWidth="1.5" /><path d="m4 7 21-3 3 29-22 2Z" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" /><path d="m8 12 13-2 2 15-13 2Z" stroke="currentColor" /><path d="m11 30 8-1" stroke="currentColor" /></svg>
          <span>나만의 카드깡!!</span>
        </div>
        <button className="header-label" type="button" aria-label="처음으로" onClick={() => { stopCamera(); setEntered(false) }}><span className="header-label-text">처음으로</span><span aria-hidden="true">↖</span></button>
        <button className="text-button help-button" aria-label="만드는 법" onClick={() => helpRef.current?.showModal()}><span className="help-label">만드는 법</span><span aria-hidden="true">↗</span></button>
      </header>

      <main className="studio-main">
        <div className="intro">
          <span className="intro-index">나만의 카드깡!! / {tab === 'photo' ? '01' : '02'}</span>
          <h1>{tab === 'photo' ? '사진 한 장, 넣어 주세요.' : '이제 카드를 꾸며요.'}</h1>
          <p>{tab === 'photo' ? '찍거나, 앨범에서 골라도 좋아요.' : '이름을 적고 마음에 드는 모습으로 저장해요.'}</p>
        </div>

        <div className="mobile-tabs" aria-label="작업 화면 선택">
          <button aria-pressed={tab === 'photo'} aria-controls="photo-panel" onClick={() => changeTab('photo')}><span className="step-number">01</span> 사진 넣기</button>
          <span className="step-line" aria-hidden="true" />
          <button aria-pressed={tab === 'card'} aria-controls="card-panel" onClick={() => changeTab('card')}><span className="step-number">02</span> 카드 꾸미기{photo && <span className="tab-ready" aria-label="사진 준비됨">✓</span>}</button>
        </div>

        <div className="workspace" data-tab={tab}>
          <section className="photo-panel" id="photo-panel" aria-label="사진 촬영">
            <div className="panel-heading"><span>01</span><h2>사진 찍기</h2><span className="panel-note">또는 불러오기</span></div>
            <div className="booth-stage">
              <div className="sketch-note booth-note" aria-hidden="true">여기 보세요<svg width="42" height="44" viewBox="0 0 42 44" fill="none"><path d="M36 3Q40 27 7 36m4-9-5 10 11 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <SketchBooth>
                {camera === 'on' ? <video ref={videoRef} autoPlay muted playsInline onLoadedData={() => setCameraReady(true)} aria-label="촬영할 구도 미리보기" /> : <PhotoPreview image={photo} crop={crop} />}
                {camera === 'off' && !photo && <span className="viewfinder-label">사진이 들어갈 자리</span>}
                {camera === 'loading' && <span className="viewfinder-status">카메라 연결 중…</span>}
                {busy && <span className="viewfinder-status">사진 준비 중…</span>}
                {countdown !== null && <span className="countdown" role="status" aria-live="assertive" key={countdown}>{countdown}</span>}
              </SketchBooth>
            </div>
            <div className="capture-actions">
              {camera === 'on' ? <button className="button primary-button" onClick={startCountdown} disabled={!cameraReady || countdown !== null || busy}><span className="shutter-icon" aria-hidden="true" />{countdown !== null ? '촬영 중…' : '3초 후 촬영'}</button> : <button className="button primary-button" onClick={() => void startCamera()} disabled={camera === 'loading' || busy}>{camera === 'loading' ? '연결 중…' : photo ? '다시 촬영' : '카메라 켜기'}<Arrow /></button>}
              <button className="text-button upload-button" onClick={() => uploadRef.current?.click()} disabled={busy || countdown !== null}>사진 불러오기</button>
              <input ref={uploadRef} className="visually-hidden" type="file" accept="image/*" onChange={(event) => void handleUpload(event)} tabIndex={-1} aria-label="사진 파일 선택" />
            </div>
            <div className="capture-note">{camera !== 'off' ? <button className="text-button" onClick={stopCamera}>카메라 끄기</button> : <span>JPG · PNG · WebP</span>}</div>
          </section>

          <section className="card-panel" id="card-panel" aria-label="카드 편집">
            <div className="panel-heading"><span>02</span><h2>카드 만들기</h2><span className="panel-note">미리보기</span></div>
            <div className="card-display">
              <button className="card-preview-button" type="button" aria-label="카드를 크게 보기" title="카드를 크게 보기" onClick={() => previewRef.current?.showModal()}><span className="card-stack" data-frame={frame}><span className="card-back" aria-hidden="true" /><PhotoPreview card canvasRef={cardCanvasRef} image={photo} crop={crop} name={cardName} note={cardNote} frame={frame} /></span></button>
              <span className="sketch-note card-note" aria-hidden="true">이렇게 나와요.</span>
            </div>
            <div className="card-tools">
              <label className="name-field"><span>이름</span><input value={cardName} onChange={(event) => setCardName(event.currentTarget.value)} maxLength={18} placeholder="카드에 넣을 이름" autoComplete="off" /></label>
              <fieldset className="frame-picker"><legend>템플릿</legend><div>{(['paper', 'ink', 'collector'] as const).map((option) => <button key={option} type="button" aria-pressed={frame === option} onClick={() => setFrame(option)} className={`frame-option ${option}`}><PhotoPreview card thumbnail image={photo} crop={crop} name={cardName} note={cardNote} frame={option} /><span>{option === 'paper' ? '스케치' : option === 'ink' ? '흑백' : '컬렉터'}</span></button>)}</div></fieldset>
              {(frame === 'collector' || photo) && <div className="customize-row">
              {frame === 'collector' && <details className="caption-editor"><summary>한 줄 소개 <span aria-hidden="true">＋</span></summary><div className="caption-controls"><label htmlFor="card-note">카드에 넣을 문장</label><input id="card-note" value={cardNote} onChange={(event) => setCardNote(event.currentTarget.value)} maxLength={32} placeholder="직접 적어 주세요" /><small>{cardNote.length}/32</small></div></details>}
              {photo && <details className="crop-editor"><summary>사진 위치 <span aria-hidden="true">＋</span></summary><div className="crop-controls">
                <label><span>확대</span><input type="range" min="1" max="3" step="0.01" value={crop.zoom} onChange={(event) => setCrop({ ...crop, zoom: Number(event.currentTarget.value) })} /><output>{crop.zoom.toFixed(1)}×</output></label>
                <label><span>좌우</span><input type="range" min="0" max="1" step="0.01" value={crop.x} onChange={(event) => setCrop({ ...crop, x: Number(event.currentTarget.value) })} /></label>
                <label><span>상하</span><input type="range" min="0" max="1" step="0.01" value={crop.y} onChange={(event) => setCrop({ ...crop, y: Number(event.currentTarget.value) })} /></label>
                <button className="text-button" onClick={() => setCrop(DEFAULT_CROP)}>처음 구도로</button>
              </div></details>}
              </div>}
              <button className="button save-button" disabled={!photo || busy || saving} onClick={() => void saveCard()}>{saving ? '저장 중…' : '카드 저장'}<Arrow down /></button>
            </div>
          </section>
        </div>
        <p className={`status-message ${message ? 'has-message' : ''}`} role="status">{message}</p>
      </main>

      <footer className="studio-footer"><span>나만의 카드깡!! © {new Date().getFullYear()}</span><span>사진은 서버에 저장하지 않아요.</span></footer>
      </>}
      <dialog ref={helpRef} className="help-dialog" onClick={(event) => { if (event.target === event.currentTarget) helpRef.current?.close() }}>
        <div className="dialog-heading"><h2>카드 만드는 법</h2><button className="close-button" aria-label="닫기" onClick={() => helpRef.current?.close()}>×</button></div>
        <ol><li><strong>사진을 준비하세요.</strong><p>카메라를 켜서 찍거나 기기에 있는 사진을 불러옵니다.</p></li><li><strong>카드를 꾸미세요.</strong><p>이름과 템플릿을 고르고, 사진 위치에서 구도를 맞춥니다.</p></li><li><strong>카드를 저장하세요.</strong><p>미리보기 그대로 PNG 파일로 내려받습니다.</p></li></ol>
        <p className="dialog-note">사진은 이 기기에서만 처리합니다. 새로고침하면 작업 내용이 사라지니 완성한 카드는 저장해 주세요.</p>
      </dialog>
      <dialog ref={previewRef} className="preview-dialog" aria-label="포토카드 크게 보기" onClick={(event) => { if (event.target === event.currentTarget) previewRef.current?.close() }}>
        <div className="preview-dialog-heading"><span>완성 카드 미리보기</span><button type="button" className="text-button" onClick={() => previewRef.current?.close()}>닫기 ×</button></div>
        <PhotoPreview card image={photo} crop={crop} name={cardName} note={cardNote} frame={frame} />
      </dialog>
    </div>
  )
}

export default App
