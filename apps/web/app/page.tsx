"use client";

import { MainLayout } from "@/components/layout";
import { StatsGroup } from "@/components/molecules";
import { IStatCardProps } from "@/components/atoms/StatCard";
import { Award, User, XCircle } from "lucide-react";
import ConcertTabs from "@/components/organisms/ConcertTabs";
import { useRole } from "@/contexts";
import { ConcertOverview, IConcert } from "@/components/organisms";
import { notify } from "@/lib";

const Stats: IStatCardProps[] = [
  { icon: User, title: "Total of seats", value: "500", bgColor: "#0070A4" },
  { icon: Award, title: "Reserve", value: "50", bgColor: "#00A58B" },
  { icon: XCircle, title: "Cancel", value: "20", bgColor: "#F96464" },
];

const mockConcerts: IConcert[] = [
  {
    id: "1",
    name: "Rock Festival 2024",
    description:
      "Experience the ultimate rock festival featuring legendary bands and emerging artists. Join thousands of fans for an unforgettable night of music, energy, and pure rock and roll.",
    seats: 5000,
    status: "reserve",
  },
  {
    id: "2",
    name: "Jazz Night Live",
    description:
      "An evening of smooth jazz with world-renowned musicians. Enjoy classic jazz standards and contemporary compositions in an intimate setting.",
    seats: 800,
    status: "reserve",
  },
  {
    id: "3",
    name: "Symphony Orchestra",
    description:
      "The National Symphony Orchestra presents a breathtaking performance of classical masterpieces by Mozart, Beethoven, and Tchaikovsky.",
    seats: 2000,
    status: "reserve",
  },
  {
    id: "4",
    name: "Pop Stars Concert",
    description:
      "The biggest pop stars come together for one spectacular night. Featuring chart-topping hits and stunning visual performances.",
    seats: 10000,
    status: "reserve",
  },
  {
    id: "5",
    name: "Electronic Music Festival",
    description:
      "Immerse yourself in the world of electronic music with top DJs from around the globe. State-of-the-art sound systems and visual effects await.",
    seats: 15000,
    status: "reserve",
  },
];

const Home = () => {
  const { role } = useRole();

  const isAdmin = role === "admin";

  return (
    <MainLayout>
      {isAdmin ? (
        <>
          <StatsGroup stats={Stats} />
          <ConcertTabs />
        </>
      ) : (
        <ConcertOverview
          concerts={mockConcerts}
          onReserve={() => notify.info("Success reserve from user")}
        />
      )}
    </MainLayout>
  );
};

export default Home;
