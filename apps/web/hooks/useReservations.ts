import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "@/lib/api";
import { concertKeys } from "./useConcerts";

export const reservationKeys = {
  all: ["reservations"] as const,
  myHistory: ["reservations", "my-history"] as const,
  history: ["reservations", "history"] as const,
};

export const useReservations = () => {
  return useQuery({
    queryKey: reservationKeys.all,
    queryFn: reservationsService.getAll,
  });
};

export const useMyHistory = () => {
  return useQuery({
    queryKey: reservationKeys.myHistory,
    queryFn: reservationsService.getMyHistory,
  });
};

export const useHistory = () => {
  return useQuery({
    queryKey: reservationKeys.history,
    queryFn: reservationsService.getHistory,
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
