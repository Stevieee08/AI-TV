import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import apiClient from '@/lib/api';
import { adaptToCourses } from '@/lib/courseAdapter';
import { useCourseStore } from '@/store/courseStore';
import { QUERY_KEYS } from '@/constants';

async function fetchCourses() {
  const [productsRes, usersRes] = await Promise.all([
    apiClient.get('/api/v1/public/randomproducts?limit=20&page=1'),
    apiClient.get('/api/v1/public/randomusers?limit=20&page=1'),
  ]);

  const productsData = productsRes.data?.data?.data ?? productsRes.data?.data ?? [];
  const usersData = usersRes.data?.data?.data ?? usersRes.data?.data ?? [];

  const products = Array.isArray(productsData) ? productsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  return adaptToCourses(products, users);
}

export function useCourses() {
  const { setCourses, loadPersistedData, reapplyCourseStatus } = useCourseStore();

  useEffect(() => {
    // Load persisted data on mount
    loadPersistedData();
  }, []);

  const query = useQuery({
    queryKey: [QUERY_KEYS.COURSES],
    queryFn: fetchCourses,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  useEffect(() => {
    if (query.data) {
      setCourses(query.data);
      // Ensure course status is applied after a short delay to handle any timing issues
      setTimeout(() => {
        reapplyCourseStatus();
      }, 100);
    }
  }, [query.data]);

  return query;
}
