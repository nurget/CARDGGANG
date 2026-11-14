import { useEffect, useRef, type RefObject } from 'react'
import { drawCard, drawPhoto, PHOTO, type Crop, type Frame } from './card'

type Props = { image: HTMLImageElement | null; crop: Crop; name?: string; note?: string; frame?: Frame; card?: boolean; canvasRef?: RefObject<HTMLCanvasElement | null> }
export default function PhotoPreview({ image, crop, name = '', note = '', frame = 'paper', card = false, canvasRef }: Props) {
  const localRef = useRef<HTMLCanvasElement>(null)
  const ref = canvasRef ?? localRef
  useEffect(() => {
    let cancelled = false
    const paint = () => {
      if (cancelled || !ref.current) return
      if (card) drawCard(ref.current, image, crop, name, frame, note)
      else {
        ref.current.width = PHOTO.width
        ref.current.height = PHOTO.height
        const context = ref.current.getContext('2d')
        if (context) drawPhoto(context, image, crop, PHOTO.width, PHOTO.height)
      }
    }
    paint()
    void document.fonts.ready.then(paint)
    return () => { cancelled = true }
  }, [image, crop, name, note, frame, card, ref])
  return <canvas ref={ref} className={card ? 'card-canvas' : 'photo-canvas'} role="img" aria-label={card ? '완성될 포토카드 미리보기' : '사진 구도 미리보기'} />
}
