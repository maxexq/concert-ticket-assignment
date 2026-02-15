"use client";

import React from "react";
import ConcertCard, { type ConcertCardType } from "../molecules/ConcertCard";

export interface IConcert {
  id: string;
  name: string;
  description: string;
  seats: number;
  status: ConcertCardType;
}

interface IConcertOverviewProps {
  concerts: IConcert[];
  cardType?: ConcertCardType;
  onReserve?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSave?: (
    id: string,
    data: { name: string; description: string; seats: number },
  ) => void;
}

const ConcertOverview = (props: IConcertOverviewProps) => {
  const { concerts, cardType, onReserve, onCancel, onDelete, onSave } = props;

  return (
    <div className="flex flex-col gap-6">
      {concerts.map((concert) => (
        <ConcertCard
          key={concert.id}
          id={concert.id}
          name={concert.name}
          description={concert.description}
          seats={concert.seats}
          type={cardType || concert.status}
          onReserve={onReserve}
          onCancel={onCancel}
          onDelete={onDelete}
          onSave={onSave}
        />
      ))}
    </div>
  );
};

export default React.memo(ConcertOverview);
