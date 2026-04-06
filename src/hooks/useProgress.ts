import { useState, useEffect } from "react";
import { fetchSubjects } from "../lib/api";
import type { SubjectResponse } from "../types";
import { useToastStore } from "../lib/utils";

export function useProgress() {
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetchSubjects()
      .then(setSubjects)
      .catch(() => addToast("error", "Failed to load progress"))
      .finally(() => setIsLoading(false));
  }, [addToast]);

  return { subjects, isLoading };
}
