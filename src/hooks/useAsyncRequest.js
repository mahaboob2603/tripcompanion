import { useState, useCallback, useRef } from 'react';

export function useAsyncRequest() {
  const [state, setState] = useState({ status: "idle", data: null, error: null });
  const requestIdRef = useRef(0);

  const run = useCallback(async (fn) => {
    const id = ++requestIdRef.current;
    setState({ status: "loading", data: null, error: null });
    try {
      const controller = new AbortController();
      // 20s timeout
      const timeout = setTimeout(() => controller.abort(), 20000);
      const data = await fn(controller.signal);
      clearTimeout(timeout);
      
      if (id !== requestIdRef.current) return; // stale response, ignore it
      
      setState({
        status: Array.isArray(data) && data.length === 0 ? "empty" : "success",
        data, 
        error: null,
      });
    } catch (err) {
      if (id !== requestIdRef.current) return; // stale error, ignore it too
      
      const kind = err.name === "AbortError" ? "timeout" : err.status === 429 ? "ratelimit" : err.status === 502 ? "upstream" : "network";
      setState({ status: "error", data: null, error: { kind, status: err.status, message: err.message } });
    }
  }, []);

  return { ...state, run };
}
