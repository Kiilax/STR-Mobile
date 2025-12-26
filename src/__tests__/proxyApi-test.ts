import { ProxyApi } from "@/utils/proxyApi"

describe("ProxyApi", () => {
  const mockFetch = global.fetch as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("request", () => {
    it("makes request with correct parameters", async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true, data: { foo: "bar" } })),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const url = "https://api.example.com"
      const endpoint = "/test"
      const options = { method: "GET" }

      const result = await ProxyApi.request(url, endpoint, options)

      expect(mockFetch).toHaveBeenCalledWith(
        `${url}${endpoint}`,
        expect.objectContaining({
          method: "GET",
          headers: expect.any(Object),
        }),
      )
      expect(result).toEqual({ foo: "bar" })
    })

    it("handles non-200 HTTP status", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue("Not Found"),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await expect(ProxyApi.request("https://site.com", "/404")).rejects.toThrow(
        "HTTP 404: Not Found",
      )
    })

    it("handles API error response (success: false)", async () => {
      const mockResponse = {
        ok: true,
        text: jest
          .fn()
          .mockResolvedValue(JSON.stringify({ success: false, error: "Custom Logic Error" })),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      await expect(ProxyApi.request("https://site.com", "/err")).rejects.toThrow(
        "Custom Logic Error",
      )

      expect(consoleSpy).toHaveBeenCalledWith("API Error:", "Custom Logic Error")
      consoleSpy.mockRestore()
    })

    it("handles empty response (204)", async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(""),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await ProxyApi.request("https://site.com", "/204")
      expect(result).toEqual({})
    })
  })

  describe("convenience methods", () => {
    it("get calls request with GET", async () => {
      const spy = jest.spyOn(ProxyApi, "request").mockResolvedValue({})
      await ProxyApi.get("url", "/end")
      expect(spy).toHaveBeenCalledWith("url", "/end", { method: "GET" })
    })

    it("post calls request with POST and stringified body", async () => {
      const spy = jest.spyOn(ProxyApi, "request").mockResolvedValue({})
      const body = { a: 1 }
      await ProxyApi.post("url", "/end", body)
      expect(spy).toHaveBeenCalledWith(
        "url",
        "/end",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
          headers: expect.objectContaining({ "Content-Type": "application/json" }),
        }),
      )
    })

    it("patch calls request with PATCH", async () => {
      const spy = jest.spyOn(ProxyApi, "request").mockResolvedValue({})
      const body = { a: 1 }
      await ProxyApi.patch("url", "/end", body)
      expect(spy).toHaveBeenCalledWith(
        "url",
        "/end",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      )
    })

    it("delete calls request with DELETE", async () => {
      const spy = jest.spyOn(ProxyApi, "request").mockResolvedValue({})
      await ProxyApi.delete("url", "/end")
      expect(spy).toHaveBeenCalledWith(
        "url",
        "/end",
        expect.objectContaining({
          method: "DELETE",
        }),
      )
    })
  })
})
