import assert from 'node:assert/strict'
import test from 'node:test'
import { CARD, PHOTO, cropRect, DEFAULT_CROP } from '../src/card.ts'

test('가로 사진은 중앙의 4:5 영역을 사용한다', () => {
  assert.deepEqual(cropRect(1200, 900, DEFAULT_CROP), { x: 240, y: 0, width: 720, height: 900 })
})

test('긴 세로 사진은 왜곡 없이 위아래를 자른다', () => {
  assert.deepEqual(cropRect(900, 1600, DEFAULT_CROP), { x: 0, y: 237.5, width: 900, height: 1125 })
})

test('최대 확대와 가장자리 이동에서도 원본 바깥을 읽지 않는다', () => {
  for (const [width, height] of [[1200, 900], [900, 1600], [1, 4000], [4000, 1], [800, 1000]]) {
    for (const zoom of [1, 1.5, 3]) {
      for (const x of [0, 0.5, 1]) for (const y of [0, 0.5, 1]) {
        const crop = cropRect(width, height, { zoom, x, y })
        assert.ok(crop.x >= 0 && crop.y >= 0)
        assert.ok(crop.x + crop.width <= width + 1e-9)
        assert.ok(crop.y + crop.height <= height + 1e-9)
        assert.ok(Math.abs(crop.width / crop.height - 0.8) < 1e-9)
      }
    }
  }
})

test('촬영 미리보기와 카드 슬롯은 같은 비율이다', () => {
  assert.equal(PHOTO.width / PHOTO.height, CARD.photo.width / CARD.photo.height)
})
