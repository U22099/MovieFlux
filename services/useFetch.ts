import { useState, useEffect, useRef } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRef = useRef(fetchFunction);
  fetchRef.current = fetchFunction;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) fetchData();
  }, [autoFetch]);

  return { data, loading, error, refetch: () => fetchData(), reset };
};

export default useFetch;
