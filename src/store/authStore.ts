import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  token: string | null;
  login: (userData: { email: string; token: string }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Check localStorage for the saved token and user data
  const token = localStorage.getItem('auth_token');
  const email = token ? 'example@mail.com' : null;  // Mock user data
  return {
    isAuthenticated: !!token,
    user: email ? { email } : null,
    token: token,
    login: (userData) => set({ isAuthenticated: true, user: { email: userData.email }, token: userData.token }),
    logout: () => {
      localStorage.removeItem('auth_token');
      set({ isAuthenticated: false, user: null, token: null });
    },
  };
});

export default useAuthStore;
