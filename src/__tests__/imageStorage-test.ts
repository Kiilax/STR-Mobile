import { ImageStorage } from "@/utils/imageStorage";
import { File, Directory, Paths } from "expo-file-system";

jest.unmock("@/utils/imageStorage");

describe("ImageStorage", () => {
  const mockFile = jest.mocked(File);
  const mockDirectory = jest.mocked(Directory);

  beforeEach(() => {
    jest.clearAllMocks();
    mockFile.mockClear();
    mockDirectory.mockClear();
  });

  describe("save", () => {
    it("moves file to document directory and returns new uri", async () => {
      const mockMove = jest.fn();
      const mockUri = "file:///original/path/image.jpg";

      mockFile.mockImplementation(
        (uri) =>
          ({
            uri: uri,
            move: mockMove,
          } as any)
      );

      mockDirectory.mockImplementation(
        (path) =>
          ({
            uri: path,
          } as any)
      );

      const result = await ImageStorage.save(mockUri);

      expect(mockFile).toHaveBeenCalledWith(mockUri);
      expect(mockDirectory).toHaveBeenCalledWith(Paths.document);
      expect(mockMove).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toBe(mockUri);
    });

    it("returns null on error", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockFile.mockImplementation(() => {
        throw new Error("Move failed");
      });

      const result = await ImageStorage.save("file://test.jpg");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving image to persistent storage:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("remove", () => {
    it("deletes file if it exists", async () => {
      const mockDelete = jest.fn();
      mockFile.mockImplementation(
        (uri) =>
          ({
            exists: true,
            delete: mockDelete,
          } as any)
      );

      const uri = "file:///test/image.jpg";
      const result = ImageStorage.remove(uri);

      expect(mockFile).toHaveBeenCalledWith(uri);
      expect(mockDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("does nothing if file does not exist", async () => {
      const mockDelete = jest.fn();
      mockFile.mockImplementation(
        (uri) =>
          ({
            exists: false,
            delete: mockDelete,
          } as any)
      );

      const result = ImageStorage.remove("file://test.jpg");

      expect(mockDelete).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("returns false on error", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockFile.mockImplementation(() => {
        throw new Error("Delete failed");
      });

      const result = ImageStorage.remove("file://test.jpg");

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error removing image from persistent storage:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
