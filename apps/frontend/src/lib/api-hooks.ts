'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Assuming backend runs on localhost:3000 as per typical NestJS setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useContracts(role: 'tenant' | 'owner') {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/contract');
      const contracts = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setData(contracts);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [role]);

  return { data, isLoading, error, refetch: fetchContracts };
}

export function usePayments(role: 'tenant' | 'owner', contractId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/payments', { params: { contractId } }); 
      setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [role, contractId]);

  return { data, isLoading, error, refetch: fetchPayments };
}

export function usePendingPayments() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPending = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/payments/pending');
      setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return { data, isLoading, error, refetch: fetchPending };
}

export function useChat(role: 'tenant' | 'owner') {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/chat');
        setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [role]);

  return { data, isLoading, error };
}

export function useApartments() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/apartment/my-apartments');
        setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApartments();
  }, []);

  return { data, isLoading, error };
}

export function useRentalRequests(role: 'tenant' | 'owner' | null) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = async () => {
    if (!role) return;
    try {
      setIsLoading(true);
      const url = role === 'owner' ? '/rental-request/owner-requests' : '/rental-request/my-requests';
      const res = await api.get(url);
      setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const handleUpdate = () => {
      fetchRequests();
    };
    
    window.addEventListener('RENTAL_REQUEST_UPDATED', handleUpdate);
    return () => window.removeEventListener('RENTAL_REQUEST_UPDATED', handleUpdate);
  }, [role]);

  return { data, isLoading, error, refetch: fetchRequests };
}
