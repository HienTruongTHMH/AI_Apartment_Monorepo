import { create } from 'zustand';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  identityCard?: string;
  isActive: boolean; // Crucial requirement: false initially upon register, true after rental confirmation
  role: 'GUEST' | 'TENANT' | 'OWNER';
  tenantProfileId?: string;
  ownerProfileId?: string;
}

interface AuthState {
  token: string | null;
  user: UserAccount | null;
  isLoggedIn: boolean;
  aiPanelOpen: boolean;
  
  // Actions
  setAuth: (token: string, user: UserAccount) => void;
  updateUser: (fields: Partial<UserAccount>) => void;
  setAccountActive: (isActive: boolean) => void;
  logout: () => void;
  toggleAiPanel: () => void;
  setAiPanelOpen: (isOpen: boolean) => void;
}

// Initial state loader from localStorage if running in client
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ai_apt_token');
  }
  return null;
};

const getStoredUser = (): UserAccount | null => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ai_apt_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isLoggedIn: !!getStoredToken(),
  aiPanelOpen: false,

  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_apt_token', token);
      localStorage.setItem('ai_apt_user', JSON.stringify(user));
    }
    set({ token, user, isLoggedIn: true });
  },

  updateUser: (fields) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...fields };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ai_apt_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  setAccountActive: (isActive: boolean) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, isActive };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ai_apt_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_apt_token');
      localStorage.removeItem('ai_apt_user');
    }
    set({ token: null, user: null, isLoggedIn: false });
  },

  toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setAiPanelOpen: (isOpen: boolean) => set({ aiPanelOpen: isOpen }),
}));
