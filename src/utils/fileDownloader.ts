import { Paths, File } from "expo-file-system";
import { fetch } from "expo/fetch";
import { ImageStorage } from "./imageStorage";

export class FileDownloader {
  /**
   * Downloads a file from the given URL and endpoint, saves it locally, and returns the local URI.
   * @param url Base URL to download the file from
   * @param endpoint Endpoint of the file to be downloaded
   * @returns Local URI of the downloaded file
   */
  static async download(url: string, endpoint: string) {
    try {
      const response = await fetch(`${url}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to download file`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "downloadedFile";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      const file = new File(Paths.document, fileName);
      file.write(await response.bytes());
      const uri = await ImageStorage.save(file.uri);
      return uri;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }
}
