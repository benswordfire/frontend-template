export async function fetchWithAuth(URL: string, options = {}) {
  return await fetch(URL, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.token || ''
    },
    ...options,
  });
}