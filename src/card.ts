export const PHOTO = { width: 800, height: 1000 }
export const CARD_SCALE = 2
export const CARD = {
  width: 640,
  height: 960,
  photo: { x: 32, y: 64, width: 576, height: 720 },
  collectorPhoto: { x: 52, y: 156, width: 536, height: 670 },
}
export type Crop = { zoom: number; x: number; y: number }
export type Frame = 'paper' | 'ink' | 'collector'
export const DEFAULT_CROP: Crop = { zoom: 1, x: 0.5, y: 0.5 }

// 촬영 화면과 모든 카드에서 같은 원본 영역을 사용한다.
export function cropRect(width: number, height: number, crop: Crop) {
  const aspect = PHOTO.width / PHOTO.height
  const cropWidth = Math.min(width, height * aspect) / crop.zoom
  const cropHeight = cropWidth / aspect
  return { x: (width - cropWidth) * crop.x, y: (height - cropHeight) * crop.y, width: cropWidth, height: cropHeight }
}

export function drawPortrait(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save()
  context.fillStyle = '#efefec'
  context.fillRect(0, 0, width, height)
  context.scale(width / 240, height / 300)
  context.strokeStyle = '#85857d'
  context.lineWidth = 1.35
  context.lineCap = 'round'
  context.lineJoin = 'round'
  const paths = [
    'M 30 290 C 31 245 44 232 85 220 L 96 206 M 151 207 L 160 220 C 202 231 213 252 214 290',
    'M 86 220 Q 120 247 160 220 M 95 222 Q 123 253 152 225',
    'M 68 133 C 56 130 58 161 71 164 M 175 133 C 189 128 187 162 175 163',
    'M 69 123 C 66 172 80 203 111 212 C 136 219 173 196 177 146 L 176 118',
    'M 66 139 C 48 105 54 74 79 67 C 78 48 104 48 117 53 C 146 36 177 54 174 71 C 197 88 191 118 179 139',
    'M 64 122 Q 71 95 85 90 Q 101 111 122 93 Q 143 114 157 91 Q 162 114 178 121',
    'M 82 134 Q 92 128 101 134 M 142 134 Q 151 129 162 134',
    'M 121 143 L 117 162 L 124 163 M 107 180 Q 121 188 137 178',
    'M 76 72 Q 65 83 68 97 M 89 64 Q 102 59 112 64 M 132 60 Q 155 53 166 72',
    'M 55 260 L 53 289 M 185 260 L 187 290',
  ]
  paths.forEach((path) => context.stroke(new Path2D(path)))
  context.fillStyle = '#85857d'
  context.beginPath(); context.ellipse(93, 145, 2, 3, 0, 0, Math.PI * 2); context.fill()
  context.beginPath(); context.ellipse(151, 145, 2, 3, 0, 0, Math.PI * 2); context.fill()
  context.restore()
}

export function drawPhoto(context: CanvasRenderingContext2D, image: HTMLImageElement | null, crop: Crop, width: number, height: number) {
  if (!image) { drawPortrait(context, width, height); return }
  const source = cropRect(image.naturalWidth, image.naturalHeight, crop)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, width, height)
}

function fittedText(context: CanvasRenderingContext2D, text: string, size: number, minSize: number, maxWidth: number, weight = 600) {
  context.font = `${weight} ${size}px "SUIT Variable", sans-serif`
  while (context.measureText(text).width > maxWidth && size > minSize) {
    size -= 1
    context.font = `${weight} ${size}px "SUIT Variable", sans-serif`
  }
}

function drawSpark(context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  context.save()
  context.translate(x, y)
  context.strokeStyle = color
  context.lineWidth = 2
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(0, -size); context.quadraticCurveTo(2, -2, size, 0)
  context.quadraticCurveTo(2, 2, 0, size)
  context.quadraticCurveTo(-2, 2, -size, 0)
  context.quadraticCurveTo(-2, -2, 0, -size)
  context.stroke()
  context.restore()
}

function drawCollectorCard(context: CanvasRenderingContext2D, image: HTMLImageElement | null, crop: Crop, name: string, note: string) {
  const { width, height, collectorPhoto: photo } = CARD
  const ink = '#29352f'
  const cream = '#fcf5e6'
  const mint = '#c6dfce'
  const coral = '#df8f96'
  const butter = '#f7dfaa'
  context.fillStyle = coral
  context.fillRect(0, 0, width, height)
  context.fillStyle = cream
  context.fillRect(17, 17, 606, 926)
  context.strokeStyle = ink
  context.lineWidth = 2.5
  context.beginPath()
  context.moveTo(18, 18)
  context.quadraticCurveTo(320, 15, 622, 18)
  context.lineTo(622, 942)
  context.quadraticCurveTo(320, 945, 18, 942)
  context.closePath()
  context.stroke()
  context.fillStyle = butter
  context.fillRect(28, 29, 584, 121)
  context.strokeStyle = ink
  context.lineWidth = 2
  context.strokeRect(28, 29, 584, 121)
  context.fillStyle = ink
  context.textAlign = 'left'
  context.font = '600 14px "SUIT Variable", sans-serif'
  context.fillText('나만의 포토카드  /  001', 42, 56)
  context.font = '25px Gaegu, sans-serif'
  context.fillText('나만의 카드깡!!', 43, 137)
  const label = name.trim() || '내 이름'
  fittedText(context, label, 50, 23, 450)
  context.fillText(label, 40, 107)
  context.fillStyle = mint
  context.beginPath(); context.arc(558, 88, 38, 0, Math.PI * 2); context.fill()
  context.strokeStyle = ink
  context.lineWidth = 2
  context.stroke()
  context.fillStyle = ink
  context.textAlign = 'center'
  context.font = '600 22px "SUIT Variable", sans-serif'
  context.fillText('1 / 1', 558, 96)
  drawSpark(context, 474, 126, 8, ink)
  drawSpark(context, 495, 123, 5, ink)

  context.fillStyle = '#fffdfa'
  context.fillRect(43, 151, 554, 684)
  context.save()
  context.beginPath(); context.rect(photo.x, photo.y, photo.width, photo.height); context.clip()
  context.translate(photo.x, photo.y)
  drawPhoto(context, image, crop, photo.width, photo.height)
  context.restore()
  context.strokeStyle = ink
  context.lineWidth = 3
  context.strokeRect(46, 153, 548, 676)
  context.strokeStyle = cream
  context.lineWidth = 1
  context.strokeRect(56, 160, 528, 660)
  // 작은 인쇄 장식은 사진 가장자리만 지나간다.
  drawSpark(context, 71, 191, 11, butter)
  drawSpark(context, 567, 245, 8, butter)
  drawSpark(context, 568, 634, 10, butter)
  context.fillStyle = coral
  context.beginPath(); context.arc(72, 560, 5, 0, Math.PI * 2); context.fill()

  context.fillStyle = butter
  context.fillRect(31, 695, 582, 211)
  context.strokeStyle = ink
  context.lineWidth = 2
  context.strokeRect(31, 695, 582, 211)
  context.fillStyle = mint
  context.beginPath()
  context.moveTo(35, 699); context.lineTo(608, 699)
  context.lineTo(608, 818); context.lineTo(35, 818)
  context.closePath()
  context.fill()
  context.strokeStyle = ink
  context.lineWidth = 2
  context.stroke()
  context.fillStyle = ink
  context.textAlign = 'left'
  context.font = '600 15px "SUIT Variable", sans-serif'
  context.fillText('한 줄 소개', 48, 730)
  context.textAlign = 'right'
  context.fillText('01 / 01', 591, 730)
  context.textAlign = 'left'
  const description = note.trim()
  if (description) {
    fittedText(context, description, 29, 16, 535, 500)
    context.fillText(description, 47, 791)
  } else {
    context.font = '600 31px "SUIT Variable", sans-serif'
    context.fillText('1 / 1', 47, 793)
  }
  context.fillStyle = ink
  context.font = '600 23px "SUIT Variable", sans-serif'
  context.fillText('나의 기록 / 001', 47, 863)
  context.font = '500 14px "SUIT Variable", sans-serif'
  context.fillText('PHOTO CARD COLLECTION', 48, 887)
  context.fillStyle = coral
  context.beginPath(); context.arc(557, 861, 29, 0, Math.PI * 2); context.fill()
  context.strokeStyle = ink
  context.lineWidth = 2
  context.stroke()
  drawSpark(context, 557, 861, 13, cream)
  context.fillStyle = ink
  context.textAlign = 'left'
  context.font = '500 12px "SUIT Variable", sans-serif'
  context.fillText('사진으로 만든 한 장', 32, 928)
  context.textAlign = 'right'
  context.fillText('NO. 001', 608, 928)
}

function drawSimpleCard(context: CanvasRenderingContext2D, image: HTMLImageElement | null, crop: Crop, name: string, frame: 'paper' | 'ink') {
  const sketch = frame === 'paper'
  const ink = sketch ? '#252621' : '#f7f6f2'
  context.fillStyle = sketch ? '#fbfaf6' : '#242722'
  context.fillRect(0, 0, CARD.width, CARD.height)
  context.strokeStyle = ink
  context.lineWidth = sketch ? 2 : 2.5
  context.beginPath()
  context.moveTo(16, 18)
  context.quadraticCurveTo(320, 14, 624, 19)
  context.quadraticCurveTo(627, 480, 623, 944)
  context.quadraticCurveTo(320, 948, 17, 943)
  context.quadraticCurveTo(13, 480, 16, 18)
  context.stroke()
  context.fillStyle = ink
  context.textAlign = 'left'
  context.font = '500 18px "SUIT Variable", sans-serif'
  context.fillText('나만의 카드깡!!', 32, 40)
  context.textAlign = 'right'
  context.fillText(sketch ? 'SKETCH / 01' : 'B&W / 01', 607, 40)
  context.save()
  context.translate(CARD.photo.x, CARD.photo.y)
  if (!sketch) context.filter = 'grayscale(1)'
  drawPhoto(context, image, crop, CARD.photo.width, CARD.photo.height)
  context.restore()
  context.strokeStyle = ink
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(31, 64)
  context.quadraticCurveTo(320, 61, 609, 64)
  context.lineTo(608, 784)
  context.quadraticCurveTo(321, 787, 32, 784)
  context.closePath()
  context.stroke()
  if (!sketch) {
    context.fillStyle = ink
    for (let y = 126; y < 750; y += 72) {
      context.beginPath(); context.arc(20, y, 3, 0, Math.PI * 2); context.fill()
      context.beginPath(); context.arc(620, y, 3, 0, Math.PI * 2); context.fill()
    }
  }
  const label = name.trim() || '내 이름'
  context.fillStyle = ink
  context.textAlign = 'left'
  fittedText(context, label, sketch ? 52 : 48, 18, 570, sketch ? 500 : 600)
  context.fillText(label, 32, 858)
  context.strokeStyle = ink
  context.lineWidth = 1
  context.beginPath(); context.moveTo(32, 885); context.lineTo(608, 885); context.stroke()
  context.textAlign = 'left'
  if (sketch) {
    context.font = '22px Gaegu, sans-serif'
    context.fillText('사진으로 만든 오늘의 카드', 32, 925)
  } else {
    context.font = '500 15px "SUIT Variable", sans-serif'
    context.fillText('MONO PHOTO EDITION', 32, 924)
  }
  context.font = '400 14px "SUIT Variable", sans-serif'
  context.textAlign = 'right'
  context.fillText('PHOTO CARD / 001', 608, 924)
}

export function drawCard(canvas: HTMLCanvasElement, image: HTMLImageElement | null, crop: Crop, name: string, frame: Frame, note = '', scale = CARD_SCALE) {
  canvas.width = CARD.width * scale
  canvas.height = CARD.height * scale
  const context = canvas.getContext('2d')
  if (!context) throw new Error('이 브라우저에서는 이미지를 만들 수 없습니다.')
  context.scale(scale, scale)
  if (frame === 'collector') drawCollectorCard(context, image, crop, name, note)
  else drawSimpleCard(context, image, crop, name, frame)
}

export async function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('이미지를 만들지 못했습니다. 다시 시도해 주세요.')), 'image/png'))
}
