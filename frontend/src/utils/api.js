const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to refresh the access token using the stored refresh token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return null;
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data.accessToken;
}

// General Fetch API wrapper with automatic Authorization header & 401 refresh
export async function apiRequest(endpoint, options = {}) {
  const accessToken = localStorage.getItem('accessToken');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If access token expired, try refreshing once and retry
  if (response.status === 401 && !endpoint.startsWith('/auth/')) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
