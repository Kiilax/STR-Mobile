import { File, Directory, Paths } from "expo-file-system";

export class ImageStorage {
  /**
   * Saves an image to persistent storage and returns the new URI.
   * @param uri URI of the image to be saved
   * @returns New URI of the saved image or null if an error occurs
   */
  static async save(uri: string) {
    try {
      const image = new File(uri);
      image.move(new Directory(Paths.document));
      return image.uri;
    } catch (error) {
      console.error("Error saving image to persistent storage:", error);
      return null;
    }
  }

  /**
   * Removes an image from persistent storage.
   * @param uri URI of the image to be removed
   * @returns True if the image was successfully removed, false otherwise
   */
  static remove(uri: string) {
    try {
      const image = new File(uri);
      if (image.exists) {
        image.delete();
        return true;
      }
    } catch (error) {
      console.error("Error removing image from persistent storage:", error);
      return false;
    }
  }
}
