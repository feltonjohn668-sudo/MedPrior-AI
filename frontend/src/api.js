export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://saltsaver-medpriorai.onrender.com' : '');
