import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { concertsService } from "@/lib/api";
import type { CreateConcertDto } from "@/lib/api";

export const concertKeys = {
  all: ["concerts"] as const,
  withStatus: ["concerts", "with-status"] as const,
  detail: (id: string) => ["concerts", id] as const,
};

export const useConcerts = () => {
  return useQuery({
    queryKey: concertKeys.all,
    queryFn: concertsService.getAll,
  });
};

export const useConcertsWithStatus = () => {
  return useQuery({
    queryKey: concertKeys.withStatus,
    queryFn: concertsService.getAllWithStatus,
  });
};

export const useConcert = (id: string) => {
  return useQuery({
    queryKey: concertKeys.detail(id),
    queryFn: () => concertsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateConcert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateConcertDto) => concertsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: concertKeys.all });
    },
  });
};

export const useDeleteConcert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => concertsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: concertKeys.all });
    },
  });
};
