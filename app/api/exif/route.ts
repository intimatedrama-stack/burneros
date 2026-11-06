import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ hasExif: false })

  const buffer = Buffer.from(await file.arrayBuffer())

  // Check for EXIF marker (0xFFE1) in JPEG or GPS chunks in PNG
  const hasExif = checkForExif(buffer)
  return NextResponse.json({ hasExif })
}

function checkForExif(buffer: Buffer): boolean {
  // JPEG: look for APP1 marker (FF E1) which contains EXIF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    for (let i = 2; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xE1) return true
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xDA) break // start of image data
    }
  }
  // PNG: check for GPS/tEXt/eXIf chunks
  if (buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
    const content = buffer.toString('ascii')
    if (content.includes('eXIf') || content.includes('GPS') || content.includes('tEXt')) return true
  }
  return false
}
