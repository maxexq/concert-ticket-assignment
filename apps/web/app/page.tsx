"use client";

import { MainLayout } from "@/components/layout";
import { StatsGroup } from "@/components/molecules";
import { IStatCardProps } from "@/components/atoms/StatCard";
import { Award, User, XCircle } from "lucide-react";
import ConcertTabs from "@/components/organisms/ConcertTabs";
import { useRole } from "@/contexts";
import { ConcertOverview, IConcert } from "@/components/organisms";
import { notify } from "@/lib";
import {
  useConcertsWithStatus,
  useCreateReservation,
  useCancelReservation,
} from "@/hooks";

const Stats: IStatCardProps[] = [
  { icon: User, title: "Total of seats", value: "500", bgColor: "#0070A4" },
  { icon: Award, title: "Reserve", value: "50", bgColor: "#00A58B" },
  { icon: XCircle, title: "Cancel", value: "20", bgColor: "#F96464" },
];

interface ConcertWithReservation extends IConcert {
  reservationId: string | null;
}

const Home = () => {
  const { role } = useRole();
  const isAdmin = role === "admin";

  const {
    data: concertsData,
    isLoading,
    error,
  } = useConcertsWithStatus({
    enabled: !isAdmin,
  });
  const createReservation = useCreateReservation();
  const cancelReservation = useCancelReservation();

  const concerts: ConcertWithReservation[] =
    concertsData?.map((concert) => ({
      id: concert.id,
      name: concert.name,
      description: concert.description,
      seats: concert.seat,
      status: concert.canCancel ? ("cancel" as const) : ("reserve" as const),
      reservationId: concert.reservationId,
    })) ?? [];

  const handleReserve = (id: string) => {
    createReservation.mutate(id, {
      onSuccess: () => notify.success("Reserved successfully"),
      onError: (err) => notify.error(err.message),
    });
  };

  const handleCancel = (concertId: string) => {
    const concert = concerts.find((c) => c.id === concertId);
    if (!concert?.reservationId) return;

    cancelReservation.mutate(concert.reservationId, {
      onSuccess: () => notify.success("Cancelled successfully"),
      onError: (err) => notify.error(err.message),
    });
  };

  if (!isAdmin && error) {
    return (
      <MainLayout>
        <div className="text-red-500">Error loading concerts</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {isAdmin ? (
        <>
          <StatsGroup stats={Stats} />
          <ConcertTabs />
        </>
      ) : isLoading ? (
        <div>Loading concerts...</div>
      ) : (
        <ConcertOverview
          concerts={concerts}
          onReserve={handleReserve}
          onCancel={handleCancel}
        />
      )}
    </MainLayout>
  );
};

export default Home;
