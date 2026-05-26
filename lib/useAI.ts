import { useState, useCallback } from "react";

interface UseAIRequestOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for making AI requests to the API
 */
export function useAIRequest<T = unknown>(
  endpoint: string,
  options: UseAIRequestOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (payload: unknown) => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Request failed");
        }

        const result = await response.json();
        setData(result.data || result);
        options.onSuccess?.(result.data || result);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        options.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options]
  );

  return {
    execute,
    loading,
    error,
    data,
    setError,
  };
}

/**
 * Hook for university recommendations
 */
export function useUniversityFinder() {
  return useAIRequest("/api/ai/universities");
}

/**
 * Hook for asking questions
 */
export function useAskAI() {
  return useAIRequest("/api/ai/ask");
}

/**
 * Hook for generating descriptions
 */
export function useGenerateDescription() {
  return useAIRequest("/api/ai/generate-description");
}
