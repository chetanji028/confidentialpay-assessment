import { useEffect, useRef, useState } from "react";
import { api } from "./api";

export function useApiData<T>(url: string, transform?: (payload: any) => T) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const transformRef = useRef(transform);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api
      .get(url)
      .then((response) => {
        if (!isMounted) return;
        const next = transformRef.current ? transformRef.current(response.data) : (response.data as T);
        setData(next);
      })
      .catch(() => {
        if (!isMounted) return;
        setData(undefined);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading };
}
