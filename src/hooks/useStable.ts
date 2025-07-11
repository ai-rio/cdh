import { useRef, useCallback, useMemo, useState, useEffect } from 'react';

/**
 * Hook to create stable references that don't change between renders
 * unless the dependencies actually change (deep comparison)
 */
export function useStableValue<T>(value: T, deps?: React.DependencyList): T {
  const ref = useRef<T>(value);
  const depsRef = useRef<React.DependencyList | undefined>(deps);

  // Only update if dependencies have actually changed
  const hasChanged = useMemo(() => {
    if (!deps && !depsRef.current) return false;
    if (!deps || !depsRef.current) return true;
    if (deps.length !== depsRef.current.length) return true;
    
    return deps.some((dep, index) => dep !== depsRef.current![index]);
  }, deps || []);

  if (hasChanged) {
    ref.current = value;
    depsRef.current = deps;
  }

  return ref.current;
}

/**
 * Hook to create stable callback that only changes when dependencies change
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  const depsRef = useRef<React.DependencyList>(deps);

  // Only update callback if dependencies have changed
  const hasChanged = useMemo(() => {
    if (deps.length !== depsRef.current.length) return true;
    return deps.some((dep, index) => dep !== depsRef.current[index]);
  }, deps);

  if (hasChanged) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Hook to prevent unnecessary re-renders by stabilizing object references
 */
export function useStableObject<T extends Record<string, any>>(obj: T): T {
  const ref = useRef<T>(obj);
  
  // Check if object has actually changed
  const hasChanged = useMemo(() => {
    const keys = Object.keys(obj);
    const prevKeys = Object.keys(ref.current);
    
    if (keys.length !== prevKeys.length) return true;
    
    return keys.some(key => obj[key] !== ref.current[key]);
  }, [obj]);

  if (hasChanged) {
    ref.current = obj;
  }

  return ref.current;
}

/**
 * Hook to debounce values and prevent excessive updates
 */
export function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to prevent effect from running on first render
 */
export function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
  }, deps);
}

/**
 * Hook to track previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}
