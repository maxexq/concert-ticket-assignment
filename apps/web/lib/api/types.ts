export interface Concert {
  id: string;
  name: string;
  description: string;
  seat: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConcertWithStatus extends Concert {
  availableSeats: number;
  isReserved: boolean;
}

export interface Reservation {
  id: string;
  username: string;
  concertId: string;
  concert: Concert;
  createdAt: string;
}

export interface ReservationHistory {
  id: string;
  username: string;
  concertName: string;
  action: "reserve" | "cancel";
  dateTime: string;
}

export interface CreateConcertDto {
  name: string;
  description: string;
  seat: number;
}

export interface CreateReservationDto {
  concertId: string;
}
