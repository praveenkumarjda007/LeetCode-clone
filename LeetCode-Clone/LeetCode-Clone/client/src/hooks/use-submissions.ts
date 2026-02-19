import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Submission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useSubmissions() {
  return useQuery({
    queryKey: [api.submissions.list.path],
    queryFn: async () => {
      const res = await fetch(api.submissions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return api.submissions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { problemId: number; code: string; language: string }) => {
      const res = await fetch(api.submissions.create.path, {
        method: api.submissions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        const error = await res.json();
        throw new Error(error.message || "Failed to submit");
      }
      return api.submissions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.submissions.list.path] });
      toast({
        title: "Submitted!",
        description: "Your code has been submitted for processing.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
