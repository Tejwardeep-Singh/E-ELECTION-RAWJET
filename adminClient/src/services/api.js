const API = import.meta.env.VITE_API_BASE_URL || '';

export const api = async (path, { role, method = 'GET', body, form } = {}) => {
  const token = role && localStorage.getItem(`${role}Token`);
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { ...(form ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
  return data;
};
