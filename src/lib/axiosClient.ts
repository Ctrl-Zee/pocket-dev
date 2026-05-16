import axios from 'axios'
import { toast } from 'sonner'

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Clerk auth token to every request
axiosClient.interceptors.request.use(async (config) => {
  // Token injection is configured per-project via Clerk's getToken()
  // See ARCHITECTURE.md > Authentication for the pattern
  return config
})

// Generic error toast on failed requests
axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? error.message
      toast.error(message)
    }
    return Promise.reject(error)
  },
)
