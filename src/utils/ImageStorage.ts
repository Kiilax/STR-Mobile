import { File, Directory, Paths } from "expo-file-system"
export class ImageStorage {
  static save(uri: string) {
    try {
      const image = new File(uri)
      image.move(new Directory(Paths.document))
      return image.uri
    } catch (error) {
      console.error("Error saving image to persistent storage:", error)
      return null
    }
  }

  static remove(uri: string) {
    try {
      const image = new File(uri)
      image.delete()
      return true
    } catch (error) {
      console.error("Error removing image from persistent storage:", error)
      return false
    }
  }
}
