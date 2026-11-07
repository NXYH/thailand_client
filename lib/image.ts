/** Uploads live in localStorage (about 5 MB), so shrink them hard before storing. */
export async function shrinkImage(file: File) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1000 / bitmap.width)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width * scale
  canvas.height = bitmap.height * scale
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL("image/jpeg", 0.7)
}

export const newId = () => Date.now().toString(36)
