import { ApiResponse } from "../types"

export class ProxyApi {
  static async request<T>(url: string, endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as any),
    }

    if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json"
    }

    const cleanedOptions: RequestInit = {
      ...options,
      headers,
      body: options.body === null ? undefined : options.body,
    }

    const response = await fetch(`${url}${endpoint}`, cleanedOptions)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const json = (await response.json()) as ApiResponse<T>

    if (!json.success) {
      console.error("API Error:", json.error)
      throw new Error(json.error || "API request failed")
    }

    return json.data
  }

  static get<T>(url: string, endpoint: string) {
    return this.request<T>(url, endpoint, { method: "GET" })
  }

  static post<T>(url: string, endpoint: string, body: any, headers: Record<string, string> = {}) {
    const isFormData = body instanceof FormData

    const requestHeaders = isFormData ? headers : { "Content-Type": "application/json", ...headers }

    return this.request<T>(url, endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers: requestHeaders,
    })
  }

  static patch<T>(url: string, endpoint: string, body: any) {
    const isFormData = body instanceof FormData

    return this.request<T>(url, endpoint, {
      method: "PATCH",
      body: isFormData ? body : JSON.stringify(body),
    })
  }

  static delete<T>(url: string, endpoint: string) {
    return this.request<T>(url, endpoint, {
      method: "DELETE",
    })
  }
}
