import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Problem } from "@shared/schema";

export function useProblems() {
  return useQuery({
    queryKey: [api.problems.list.path],
    queryFn: async () => {
      const res = await fetch(api.problems.list.path);
      if (!res.ok) throw new Error("Failed to fetch problems");
      return api.problems.list.responses[200].parse(await res.json());
    },
  });
}

export function useProblem(slug: string) {
  return useQuery({
    queryKey: [api.problems.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.problems.get.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch problem");
      return api.problems.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}
