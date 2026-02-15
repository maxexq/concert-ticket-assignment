import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "@/lib/api";
import { concertKeys } from "./useConcerts";

export const reservationKeys = {
  all: ["reservations"] as const,
  myHistory: ["reservations", "my-history"] as const,
  history: ["reservations", "history"] as const,
  stats: ["reservations", "stats"] as const,
};

export const useReservations = () => {
  return useQuery({
    queryKey: reservationKeys.all,
    queryFn: () => reservationsService.getAll(),
  });
};

export const useMyHistory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: reservationKeys.myHistory,
    queryFn: () => reservationsService.getMyHistory(),
    enabled: options?.enabled ?? true,
  });
};

export const useHistory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: reservationKeys.history,
    queryFn: () => reservationsService.getHistory(),
    enabled: options?.enabled ?? true,
  });
};

export const useStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: reservationKeys.stats,
    queryFn: () => reservationsService.getStats(),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (concertId: string) => reservationsService.create(concertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
      queryClient.invalidateQueries({ queryKey: reservationKeys.myHistory });
      queryClient.invalidateQueries({ queryKey: concertKeys.withStatus });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reservationsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
      queryClient.invalidateQueries({ queryKey: reservationKeys.myHistory });
      queryClient.invalidateQueries({ queryKey: concertKeys.withStatus });
    },
  });
};
