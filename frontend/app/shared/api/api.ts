import {
  Category,
  CategoryResponse,
  SearchVideoResponse,
  Video,
} from "../model/type";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1/";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    const url = this.buildUrl(endpoint, params);

    const defaultOptions: RequestInit = {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...fetchOptions });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", params });
  }
}

const apiClient = new ApiClient(baseUrl);

export const fetchVideos = async (params?: {
  query?: string;
  page?: number;
  limit?: number;
  categoryIds?: string[];
  sortBy?: string;
  sortOrder?: string;
}): Promise<Video[]> => {
  try {
    const response = await apiClient.get<ApiResponse<SearchVideoResponse>>(
      "videos"
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<ApiResponse<CategoryResponse>>(
      "categories"
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchVideoById = async (id: string): Promise<Video | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Video }>(
      `videos/${id}`
    );
    return response.success ? response.data : null;
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
};

// Export the client for direct use
export { apiClient };
export default apiClient;
