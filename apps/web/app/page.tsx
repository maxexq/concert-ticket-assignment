import { MainLayout } from "@/components/layout";
import { TestToastButton } from "@/components";
import { StatsGroup } from "@/components/molecules";
import { IStatCardProps } from "@/components/atoms/StatCard";
import { Award, Save, Trash2, User, XCircle } from "lucide-react";
import Button from "@/components/atoms/Button";
import ConcertCard from "@/components/molecules/ConcertCard";

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
      <Button title="Delete" icon={Trash2} variant="danger" size="lg" />
      <Button title="Save" icon={Save} variant="primary" size="lg" />
      <Button title="Cancel" variant="warning" size="lg" />
      <Button title="Reserve" variant="primary" size="lg" />

      <ConcertCard
        id="test"
        name="Concert Name "
        description="Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque."
        seats={2000}
      />
      <ConcertCard
        id="test"
        name="Concert Name"
        description="Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque."
        seats={2000}
        type="cancel"
      />
      <ConcertCard
        id="test"
        name="Concert Name"
        description="Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque."
        seats={2000}
        type="cancel"
      />
      <ConcertCard
        id="test"
        name="Concert Name"
        description="Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque."
        seats={2000}
        type="edit"
      />
    </MainLayout>
  );
};

export default Home;
