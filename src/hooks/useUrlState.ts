import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * Custom hook for synchronizing state with URL search parameters
 * Provides utilities to get/set URL parameters while preserving others
 */
export const useUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get a specific parameter value
  const getParam = useCallback((key: string, defaultValue?: string): string => {
    return searchParams.get(key) || defaultValue || '';
  }, [searchParams]);

  // Get multiple parameters as an object
  const getParams = useCallback((keys: string[]): Record<string, string> => {
    const result: Record<string, string> = {};
    keys.forEach(key => {
      result[key] = searchParams.get(key) || '';
    });
    return result;
  }, [searchParams]);

  // Set multiple parameters while preserving others
  const setParams = useCallback((params: Record<string, string | number | undefined>) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 0) {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });
      
      return newParams;
    });
  }, [setSearchParams]);

  // Get current search params as a string for creating links
  const getSearchString = useCallback((): string => {
    return searchParams.toString();
  }, [searchParams]);

  // Create a link with additional parameters while preserving current ones
  const createLinkWithState = useCallback((basePath: string, additionalParams?: Record<string, string>): string => {
    const params = new URLSearchParams(searchParams);
    
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
    }
    
    const searchString = params.toString();
    return searchString ? `${basePath}?${searchString}` : basePath;
  }, [searchParams]);

  return {
    getParam,
    getParams,
    setParams,
    getSearchString,
    createLinkWithState,
    searchParams
  };
};

/**
 * Hook specifically for managing search/roster state in URLs
 */
export const useRosterUrlState = () => {
  const { getParam, getParams, setParams, createLinkWithState } = useUrlState();

  // Get current roster state from URL
  const getRosterState = useCallback(() => {
    return {
      firstName: getParam('firstName'),
      lastName: getParam('lastName'),
      badgeNumber: getParam('badgeNumber'),
      page: parseInt(getParam('page', '1')) || 1,
      pageSize: parseInt(getParam('pageSize', '25')) || 25,
      sortBy: getParam('sortBy', 'name') as 'name' | 'regular_pay' | 'overtime' | 'total_compensation',
      sortOrder: getParam('sortOrder', 'asc') as 'asc' | 'desc',
      source: getParam('source', 'search') // 'search' or 'roster'
    };
  }, [getParam]);

  // Set roster state in URL
  const setRosterState = useCallback((state: {
    firstName?: string;
    lastName?: string;
    badgeNumber?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    source?: string;
  }) => {
    setParams(state);
  }, [setParams]);

  // Create profile link with current state preserved
  const createProfileLink = useCallback((personId: string): string => {
    return createLinkWithState(`/profile/${personId}`, {
      returnTo: typeof window !== 'undefined' ? window.location.pathname : '',
    });
  }, [createLinkWithState]);

  // Get return path from URL parameters
  const getReturnPath = useCallback((): string => {
    const returnTo = getParam('returnTo');
    const currentState = getRosterState();
    
    if (returnTo) {
      // Construct return URL with preserved state
      const params = new URLSearchParams();
      if (currentState.firstName) params.set('firstName', currentState.firstName);
      if (currentState.lastName) params.set('lastName', currentState.lastName);
      if (currentState.badgeNumber) params.set('badgeNumber', currentState.badgeNumber);
      if (currentState.page > 1) params.set('page', String(currentState.page));
      if (currentState.pageSize !== 25) params.set('pageSize', String(currentState.pageSize));
      if (currentState.sortBy !== 'name') params.set('sortBy', currentState.sortBy);
      if (currentState.sortOrder !== 'asc') params.set('sortOrder', currentState.sortOrder);
      if (currentState.source !== 'search') params.set('source', currentState.source);
      
      const searchString = params.toString();
      return searchString ? `${returnTo}?${searchString}` : returnTo;
    }
    
    // Default fallback based on source
    return currentState.source === 'roster' ? '/roster' : '/';
  }, [getParam, getRosterState]);

  return {
    getRosterState,
    setRosterState,
    createProfileLink,
    getReturnPath
  };
};