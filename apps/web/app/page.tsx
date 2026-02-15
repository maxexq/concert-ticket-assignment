"use client";

import { MainLayout } from "@/components/layout";
import { StatsGroup } from "@/components/molecules";
import { IStatCardProps } from "@/components/atoms/StatCard";
import { Award, User, XCircle } from "lucide-react";
import ConcertTabs from "@/components/organisms/ConcertTabs";
import { useRole } from "@/contexts";
import { ConcertOverview, IConcert } from "@/components/organisms";
import { notify, handleMutationError } from "@/lib";
import {
  useConcertsWithStatus,
  useCreateReservation,
  useCancelReservation,
  useStats,
} from "@/hooks";

interface ConcertWithReservation extends IConcert {
  reservationId: string | null;
}

const Home = () => {
  const { role, isLoading: roleLoading } = useRole();
  const isAdmin = role === "admin";

  const { data: statsData } = useStats({
    enabled: isAdmin && !roleLoading,
  });

  const {
    data: concertsData,
    isLoading,
    error,
  } = useConcertsWithStatus({
    enabled: !isAdmin && !roleLoading,
  });
  const createReservation = useCreateReservation();
  const cancelReservation = useCancelReservation();

  const stats: IStatCardProps[] = [
    {
      icon: User,
      title: "Total of seats",
      value: statsData?.totalSeats?.toLocaleString() ?? "0",
      bgColor: "#0070A4",
    },
    {
      icon: Award,
      title: "Reserve",
      value: statsData?.reserveCount?.toLocaleString() ?? "0",
      bgColor: "#00A58B",
    },
    {
      icon: XCircle,
      title: "Cancel",
      value: statsData?.cancelCount?.toLocaleString() ?? "0",
      bgColor: "#F96464",
    },
  ];

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
      onError: handleMutationError,
    });
  };

  const handleCancel = (concertId: string) => {
    const concert = concerts.find((c) => c.id === concertId);
    if (!concert?.reservationId) return;

    cancelReservation.mutate(concert.reservationId, {
      onSuccess: () => notify.success("Cancel successfully"),
      onError: handleMutationError,
    });
  };

  if (!isAdmin && error) {
    return (
      <MainLayout>
        <div className="text-red-500">Error loading concerts</div>
      </MainLayout>
    );
  }

  if (roleLoading) {
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {isAdmin ? (
        <>
          <StatsGroup stats={stats} />
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
