import api from "./axios";
import type { Reservation, ReservationHistory, Stats } from "./types";

export const reservationsService = {
  getAll: () => api.get<Reservation[]>("/reservations").then((res) => res.data),

  getMyHistory: () =>
    api.get<ReservationHistory[]>("/reservations/my-history").then((res) => res.data),

  getHistory: () =>
    api.get<ReservationHistory[]>("/reservations/history").then((res) => res.data),

  getStats: () =>
    api.get<Stats>("/reservations/stats").then((res) => res.data),

  create: (concertId: string) =>
    api.post<Reservation>("/reservations", { concertId }).then((res) => res.data),

  cancel: (id: string) => api.delete(`/reservations/${id}`),
};
