type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface ApiFetchOptions extends RequestInit {
  method?: HTTPMethod;
  headers?: HeadersInit;
  body?: any;
}

interface ApiResponse<T> extends Response {
  data?: T;
}

async function apiFetch<T>(url: string, options: ApiFetchOptions = {}): Promise<ApiResponse<T>> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const mergedHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };
  
  const fetchOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };
  
  if (options.body && typeof options.body === 'object') {
    fetchOptions.body = JSON.stringify(options.body);
  }
  
  try {
    const response: ApiResponse<T> = await fetch(url, fetchOptions) as ApiResponse<T>;
    
    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        response.data = await response.json() as T;
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    } else {
      console.warn('Response is not JSON. Content-Type:', contentType);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default apiFetch;