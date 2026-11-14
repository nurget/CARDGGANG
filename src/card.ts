export const PHOTO = { width: 800, height: 1000 }
export const CARD_SCALE = 2
export const CARD = {
  width: 640,
  height: 960,
  photo: { x: 32, y: 64, width: 576, height: 720 },
  flamePhoto: { x: 40, y: 100, width: 560, height: 700 },
}
export type Crop = { zoom: number; x: number; y: number }
export type Frame = 'paper' | 'ink' | 'flame'
export const DEFAULT_CROP: Crop = { zoom: 1, x: 0.5, y: 0.5 }

// 두 미리보기와 PNG가 같은 원본 영역을 사용해야 촬영 구도가 바뀌지 않는다.
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

function drawSpark(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  context.save()
  context.translate(x, y)
  context.strokeStyle = '#f4d28f'
  context.lineWidth = 1.4
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(0, -size); context.quadraticCurveTo(2, -2, size, 0)
  context.quadraticCurveTo(2, 2, 0, size)
  context.quadraticCurveTo(-2, 2, -size, 0)
  context.quadraticCurveTo(-2, -2, 0, -size)
  context.stroke()
  context.restore()
}

function drawFlameCard(context: CanvasRenderingContext2D, image: HTMLImageElement | null, crop: Crop, name: string, note: string) {
  const { width, height, flamePhoto: photo } = CARD
  const gold = '#e5b86f'
  context.fillStyle = '#26141b'
  context.fillRect(0, 0, width, height)

  // 바깥 인쇄선과 반복 빗금은 원본 작품의 프레임을 사용하지 않는 카드깡 고유 장식이다.
  context.strokeStyle = '#a83544'
  context.lineWidth = 18
  context.strokeRect(9, 9, width - 18, height - 18)
  context.strokeStyle = gold
  context.lineWidth = 2
  context.strokeRect(19, 19, width - 38, height - 38)
  context.strokeStyle = 'rgba(229,184,111,.42)'
  context.lineWidth = 1
  for (let y = 123; y < 760; y += 21) {
    context.beginPath(); context.moveTo(21, y + 6); context.lineTo(31, y); context.stroke()
    context.beginPath(); context.moveTo(609, y + 6); context.lineTo(619, y); context.stroke()
  }

  context.fillStyle = '#f8efe5'
  context.textAlign = 'left'
  context.font = '600 18px "SUIT Variable", sans-serif'
  context.fillText('CARD GGANG', 43, 52)
  context.fillStyle = gold
  context.font = '500 24px "SUIT Variable", sans-serif'
  context.fillText('FLAME', 43, 84)
  context.strokeStyle = gold
  context.lineWidth = 1.2
  context.beginPath(); context.moveTo(155, 76); context.lineTo(478, 76); context.stroke()
  context.font = '500 15px "SUIT Variable", sans-serif'
  context.textAlign = 'right'
  context.fillText('GG / 001', 589, 52)
  context.beginPath(); context.arc(556, 75, 17, 0, Math.PI * 2); context.stroke()
  context.beginPath()
  context.moveTo(555, 62); context.bezierCurveTo(563, 69, 562, 75, 557, 81)
  context.bezierCurveTo(561, 73, 552, 71, 553, 77)
  context.bezierCurveTo(549, 83, 557, 88, 561, 81)
  context.stroke()

  context.save()
  context.beginPath()
  context.roundRect(photo.x, photo.y, photo.width, photo.height, 12)
  context.clip()
  context.save()
  context.translate(photo.x, photo.y)
  drawPhoto(context, image, crop, photo.width, photo.height)
  context.restore()

  // 사진의 중앙과 얼굴은 보존하고 가장자리만 색으로 묶는다.
  const leftShade = context.createLinearGradient(photo.x, 0, photo.x + 100, 0)
  leftShade.addColorStop(0, 'rgba(54,12,27,.53)')
  leftShade.addColorStop(1, 'rgba(54,12,27,0)')
  context.fillStyle = leftShade; context.fillRect(photo.x, photo.y, 100, photo.height)
  const rightShade = context.createLinearGradient(photo.x + photo.width, 0, photo.x + photo.width - 100, 0)
  rightShade.addColorStop(0, 'rgba(54,12,27,.48)')
  rightShade.addColorStop(1, 'rgba(54,12,27,0)')
  context.fillStyle = rightShade; context.fillRect(photo.x + photo.width - 100, photo.y, 100, photo.height)
  const footShade = context.createLinearGradient(0, 650, 0, 800)
  footShade.addColorStop(0, 'rgba(35,11,22,0)')
  footShade.addColorStop(1, 'rgba(35,11,22,.82)')
  context.fillStyle = footShade; context.fillRect(photo.x, 650, photo.width, 150)

  context.strokeStyle = 'rgba(255,227,181,.78)'
  context.lineWidth = 1.3
  context.beginPath()
  context.moveTo(68, 303); context.bezierCurveTo(118, 287, 102, 244, 75, 224)
  context.moveTo(574, 270); context.bezierCurveTo(529, 292, 548, 343, 585, 367)
  context.moveTo(74, 575); context.bezierCurveTo(109, 550, 105, 524, 79, 497)
  context.moveTo(568, 573); context.bezierCurveTo(534, 606, 552, 637, 584, 654)
  context.stroke()
  const sparks: Array<[number, number, number]> = [[82, 151, 12], [571, 178, 8], [87, 437, 7], [556, 506, 11], [101, 692, 6], [558, 715, 7]]
  sparks.forEach(([x, y, size]) => drawSpark(context, x, y, size))
  context.restore()

  context.strokeStyle = gold
  context.lineWidth = 3
  context.beginPath(); context.roundRect(photo.x + 1.5, photo.y + 1.5, photo.width - 3, photo.height - 3, 11); context.stroke()
  context.strokeStyle = 'rgba(255,245,219,.55)'
  context.lineWidth = 1
  context.beginPath(); context.roundRect(photo.x + 8, photo.y + 8, photo.width - 16, photo.height - 16, 7); context.stroke()

  context.fillStyle = '#9f293f'
  context.beginPath()
  context.moveTo(21, 770); context.lineTo(573, 770); context.lineTo(620, 785)
  context.lineTo(620, 864); context.lineTo(21, 864); context.closePath(); context.fill()
  context.strokeStyle = gold; context.lineWidth = 2
  context.beginPath(); context.moveTo(22, 771); context.lineTo(572, 771); context.lineTo(619, 786); context.stroke()
  context.fillStyle = '#f0c889'
  context.textAlign = 'left'
  context.font = '500 16px "SUIT Variable", sans-serif'
  context.fillText('FLAME SERIES', 46, 800)
  context.textAlign = 'right'; context.fillText('01 / 01', 592, 800)
  const label = name.trim() || 'YOUR NAME'
  let size = 54
  context.textAlign = 'left'
  context.fillStyle = '#fff8ef'
  context.font = `600 ${size}px "SUIT Variable", sans-serif`
  while (context.measureText(label).width > 540 && size > 22) {
    size -= 1
    context.font = `600 ${size}px "SUIT Variable", sans-serif`
  }
  context.fillText(label, 46, 849)

  context.fillStyle = '#f8efe5'
  context.font = '400 24px "SUIT Variable", sans-serif'
  const description = note.trim()
  if (description) {
    let noteSize = 24
    while (context.measureText(description).width > 540 && noteSize > 14) {
      noteSize -= 1
      context.font = `400 ${noteSize}px "SUIT Variable", sans-serif`
    }
    context.fillText(description, 46, 898)
  }
  context.strokeStyle = 'rgba(229,184,111,.65)'
  context.lineWidth = 1
  context.beginPath(); context.moveTo(44, 913); context.lineTo(596, 913); context.stroke()
  context.fillStyle = '#e5b86f'
  context.font = '500 15px "SUIT Variable", sans-serif'
  context.fillText('CARD GGANG  /  PHOTO EDITION', 46, 935)
  context.textAlign = 'right'; context.fillText('GG / F-001', 592, 935)
}

export function drawCard(canvas: HTMLCanvasElement, image: HTMLImageElement | null, crop: Crop, name: string, frame: Frame, note = '') {
  canvas.width = CARD.width * CARD_SCALE
  canvas.height = CARD.height * CARD_SCALE
  const context = canvas.getContext('2d')
  if (!context) throw new Error('이 브라우저에서는 이미지를 만들 수 없습니다.')
  context.scale(CARD_SCALE, CARD_SCALE)
  if (frame === 'flame') {
    drawFlameCard(context, image, crop, name, note)
    return
  }
  const ink = frame === 'ink' ? '#fafafa' : '#20201e'
  context.fillStyle = frame === 'ink' ? '#20201e' : '#ffffff'
  context.fillRect(0, 0, CARD.width, CARD.height)
  context.fillStyle = ink
  context.font = '500 18px "SUIT Variable", sans-serif'
  context.fillText('CARD GGANG', 32, 39)
  context.textAlign = 'right'
  context.fillText('01', 607, 39)
  context.save()
  context.translate(CARD.photo.x, CARD.photo.y)
  drawPhoto(context, image, crop, CARD.photo.width, CARD.photo.height)
  context.restore()
  context.fillStyle = ink
  context.textAlign = 'left'
  const label = name.trim() || 'YOUR NAME'
  let size = 45
  context.font = `500 ${size}px "SUIT Variable", sans-serif`
  while (context.measureText(label).width > 570 && size > 18) {
    size -= 1
    context.font = `500 ${size}px "SUIT Variable", sans-serif`
  }
  context.fillText(label, 32, 858)
  context.strokeStyle = ink
  context.lineWidth = 1
  context.beginPath(); context.moveTo(32, 885); context.lineTo(608, 885); context.stroke()
  context.font = '400 18px "Gaegu", sans-serif'
  context.fillText('카드깡', 32, 925)
  context.font = '400 14px "SUIT Variable", sans-serif'
  context.textAlign = 'right'
  context.fillText('PHOTO CARD / 01', 608, 924)
}

export async function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('이미지를 만들지 못했습니다. 다시 시도해 주세요.')), 'image/png'))
}
