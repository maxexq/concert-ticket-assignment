import { MainLayout } from "@/components/layout";
import { TestToastButton } from "@/components";
import StatCard from "@/components/atoms/StatCard";
import { Badge, User, XCircle } from "lucide-react";

const Home = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center gap-8.75">
        <StatCard icon={User} title="Stars" value="100" color="yellow" />
        <StatCard icon={Badge} title="Likes" value="50" color="red" />
        <StatCard icon={XCircle} title="Comments" value="20" color="blue" />
      </div>
      <TestToastButton />
    </MainLayout>
  );
};

export default Home;
