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

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        // Map to the correct endpoint. Using /contract as defined in spec.
        const res = await api.get('/contract');
        
        // Ensure data is array
        const contracts = Array.isArray(res.data) ? res.data : (res.data.data || []);
        
        // Filter out by role if the backend returns all (in a real scenario backend filters this)
        // But for UI stability, just return what backend gives.
        setData(contracts);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [role]);

  return { data, isLoading, error };
}

export function usePayments(role: 'tenant' | 'owner') {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/payment'); 
        setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [role]);

  return { data, isLoading, error };
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
