import axios, { AxiosInstance, AxiosError } from "axios";
import { useRouter } from "vue-router";

// Define custom error classes for validation and general errors
class ValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super("Validation Error");
    this.errors = errors;
  }
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

// Create a reusable function for Axios instance
const createApiClient = (): AxiosInstance => {
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true, // Allow sending cookies
  });

  // Request interceptor to add headers like Authorization
  axiosInstance.interceptors.request.use(
    (config) => {
      //const token = localStorage.getItem("login-token");

      const token = useCookie('accessToken').value;
      //console.log('accessToken', token)

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // Set default headers for JSON payloads
      config.headers["Content-Type"] = "application/json";
      return config;
    },
    (error) => {
      // Handle request setup errors
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for managing validation and general errors
  axiosInstance.interceptors.response.use(
    (response) => {
      // Optionally transform or log successful responses
      return response;
    },
    (error: AxiosError) => {
      const response = error.response;

      if (response) {
        const { status, data } = response;

        // Handle specific HTTP status codes
        if (status === 401 || status === 403) {
          localStorage.removeItem("login-token"); // Clear token if unauthorized
          router.push("/auth/login"); // Redirect to login
          return;
        }

        if (status === 422) {
          // Handle validation errors
          throw new ValidationError(data?.errors || {});
        }

        // Handle other API-related errors
        throw new ApiError(status, data);
      }

      // Handle unknown errors or network issues
      console.error("Network or unknown error:", error);
      throw error;
    }
  );

  return axiosInstance;
};

export default createApiClient;








// import { createFetch } from '@vueuse/core'
// import { destr } from 'destr'

// export const callApi = createFetch({
//   baseUrl: 'http://localhost:8000/api',
//   fetchOptions: {
//     headers: {
//       Accept: 'application/json',
//     },
//   },
//   options: {
//     refetch: true,
//     async beforeFetch({ options }) {
//       const accessToken = useCookie('accessToken').value

//       if (accessToken) {
//         options.headers = {
//           ...options.headers,
//           Authorization: `Bearer ${accessToken}`,
//         }
//       }

//       return { options }
//     },
//     afterFetch(ctx) {
//       const { data, response } = ctx

//       // Parse data if it's JSON

//       let parsedData = null
//       try {
//         parsedData = destr(data)
//       }
//       catch (error) {
//         console.error(error)
//       }

//       return { data: parsedData, response }
//     },
//   },
// })
