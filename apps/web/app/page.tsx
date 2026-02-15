import { MainLayout } from "@/components/layout";
import { TestToastButton } from "@/components";
import StatsGroup from "@/components/molecules/StatsGroup";
import { IStatCardProps } from "@/components/atoms/StatCard";
import { Award, User, XCircle } from "lucide-react";

const Stats: IStatCardProps[] = [
  { icon: User, title: "Total of seats", value: "500", bgColor: "#0070A4" },
  { icon: Award, title: "Reserve", value: "50", bgColor: "#00A58B" },
  { icon: XCircle, title: "Cancel", value: "20", bgColor: "#F96464" },
];

const Home = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center gap-8.75">
        <StatsGroup stats={Stats} />
      </div>
      <TestToastButton />
    </MainLayout>
  );
};

export default Home;
