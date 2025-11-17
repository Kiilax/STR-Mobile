import { File, Directory, Paths } from "expo-file-system"
export function useImageStorage() {
  async function save(uri: string) {
    try {
      const image = new File(uri)
      image.move(new Directory(Paths.document))
      return image.uri
    } catch (error) {
      console.error("Error saving image to persistent storage:", error)
      return null
    }
  }

  async function remove(uri: string) {
    try {
      const image = new File(uri)
      await image.delete()
      return true
    } catch (error) {
      console.error("Error removing image from persistent storage:", error)
      return false
    }
  }

  return {
    save,
    remove,
  }
}
