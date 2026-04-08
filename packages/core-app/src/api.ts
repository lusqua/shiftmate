const API_URL = import.meta.env.PUBLIC_API_URL ?? "http://localhost:3001/api";

export const api = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  return res.json();
};
