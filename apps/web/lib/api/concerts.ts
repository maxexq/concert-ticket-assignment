import api from "./axios";
import type { Concert, ConcertWithStatus, CreateConcertDto } from "./types";

export const concertsService = {
  getAll: () => api.get<Concert[]>("/concerts").then((res) => res.data),

  getAllWithStatus: () =>
    api.get<ConcertWithStatus[]>("/concerts/with-status").then((res) => res.data),

  getById: (id: string) =>
    api.get<Concert>(`/concerts/${id}`).then((res) => res.data),

  create: (dto: CreateConcertDto) =>
    api.post<Concert>("/concerts", dto).then((res) => res.data),

  delete: (id: string) => api.delete(`/concerts/${id}`),
};
