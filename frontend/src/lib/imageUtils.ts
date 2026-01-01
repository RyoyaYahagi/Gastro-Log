// 画像をリサイズ・圧縮するユーティリティ

const MAX_WIDTH = 800
const MAX_HEIGHT = 800
const QUALITY = 0.7 // JPEG品質 (0-1)

export function resizeImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            let width = img.width
            let height = img.height

            // アスペクト比を維持してリサイズ
            if (width > MAX_WIDTH) {
                height = (height * MAX_WIDTH) / width
                width = MAX_WIDTH
            }
            if (height > MAX_HEIGHT) {
                width = (width * MAX_HEIGHT) / height
                height = MAX_HEIGHT
            }

            // Canvas でリサイズ
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Canvas context not available'))
                return
            }

            ctx.drawImage(img, 0, 0, width, height)

            // JPEG として圧縮
            const resizedDataUrl = canvas.toDataURL('image/jpeg', QUALITY)
            resolve(resizedDataUrl)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = dataUrl
    })
}
