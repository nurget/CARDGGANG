export const PHOTO = { width: 800, height: 1000 }
export const CARD = { width: 640, height: 960, photo: { x: 32, y: 64, width: 576, height: 720 } }
export type Crop = { zoom: number; x: number; y: number }
export type Frame = 'paper' | 'ink'
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

export function drawCard(canvas: HTMLCanvasElement, image: HTMLImageElement | null, crop: Crop, name: string, frame: Frame) {
  canvas.width = CARD.width
  canvas.height = CARD.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('이 브라우저에서는 이미지를 만들 수 없습니다.')
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
