import { create } from 'zustand';
import axios from 'axios';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  identityCard?: string;
  isActive: boolean;
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

  refreshUser: async () => {
    const { token, user } = useAuthStore.getState();
    if (!token) return;
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        const data = response.data;
        if (data && data.user) {
          const u = data.user;
          let finalRole: 'GUEST' | 'TENANT' | 'OWNER' = 'GUEST';
          if (u.role) {
            const upper = u.role.toUpperCase();
            if (upper === 'OWNER') finalRole = 'OWNER';
            else if (upper === 'TENANT') finalRole = 'TENANT';
            else if (upper === 'GUEST') finalRole = 'GUEST';
          } else {
            if (u.hasOwnerProfile || u.ownerProfileId) {
              finalRole = 'OWNER';
            } else if (u.hasTenantProfile || u.tenantProfileId) {
              finalRole = 'TENANT';
            }
          }

          const updatedUser = {
            ...user,
            id: u.accountId || user?.id,
            email: u.email || user?.email,
            fullName: u.fullName || user?.fullName,
            isActive: typeof u.isActive === 'boolean' ? u.isActive : false,
            role: finalRole,
            tenantProfileId: u.tenantProfileId || undefined,
            ownerProfileId: u.ownerProfileId || undefined,
            isTenancyActivated: typeof u.isTenancyActivated === 'boolean' ? u.isTenancyActivated : false
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('ai_apt_user', JSON.stringify(updatedUser));
          }
          set({ user: updatedUser as UserAccount });
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải lại thông tin tài khoản:', err);
    }
  }
}));
