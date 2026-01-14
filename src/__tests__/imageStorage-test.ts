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
    it("overwrites existing file and returns new uri", async () => {
      const mockMove = jest.fn();
      const mockDelete = jest.fn();
      const mockUri = "file:///original/path/image.jpg";
      const mockDestinationUri = "file:///document/path/image.jpg";

      mockFile.mockImplementation(((path: string, fileName?: string) => {
        if (path === mockUri) {
          return {
            uri: mockUri,
            move: mockMove,
          };
        } else {
          return {
            uri: mockDestinationUri,
            exists: true,
            delete: mockDelete,
          };
        }
      }) as any);

      const result = await ImageStorage.save(mockUri);

      expect(mockFile).toHaveBeenCalledWith(mockUri);
      expect(mockFile).toHaveBeenCalledWith(Paths.document, "image.jpg");

      expect(mockDelete).toHaveBeenCalled();
      expect(mockMove).toHaveBeenCalledWith(
        expect.objectContaining({ uri: mockDestinationUri })
      );

      expect(result).toBe(mockDestinationUri);
    });

    it("moves file without delete if destination does not exist", async () => {
      const mockMove = jest.fn();
      const mockDelete = jest.fn();
      const mockUri = "file:///original/path/image.jpg";
      const mockDestinationUri = "file:///document/path/image.jpg";

      mockFile.mockImplementation(((path: string, fileName?: string) => {
        if (path === mockUri) {
          return {
            uri: mockUri,
            move: mockMove,
          };
        } else {
          return {
            uri: mockDestinationUri,
            exists: false,
            delete: mockDelete,
          };
        }
      }) as any);

      const result = await ImageStorage.save(mockUri);

      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockMove).toHaveBeenCalledWith(
        expect.objectContaining({ uri: mockDestinationUri })
      );
      expect(result).toBe(mockDestinationUri);
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
