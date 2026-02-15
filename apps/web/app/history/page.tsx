"use client";

import { MainLayout } from "@/components/layout";
import { HistoryTable, IHistoryRecord } from "@/components/molecules";

const mockHistoryData: IHistoryRecord[] = [
  {
    id: "1",
    dateTime: "2024-01-15 14:30:00",
    username: "john_doe",
    concertName: "Rock Festival 2024",
    action: "Reserve",
  },
  {
    id: "2",
    dateTime: "2024-01-14 10:15:00",
    username: "jane_smith",
    concertName: "Jazz Night Live",
    action: "Reserve",
  },
  {
    id: "3",
    dateTime: "2024-01-13 18:45:00",
    username: "mike_wilson",
    concertName: "Symphony Orchestra",
    action: "Cancel",
  },
  {
    id: "4",
    dateTime: "2024-01-12 20:00:00",
    username: "sarah_johnson",
    concertName: "Pop Stars Concert",
    action: "Reserve",
  },
  {
    id: "5",
    dateTime: "2024-01-11 16:30:00",
    username: "david_brown",
    concertName: "Electronic Music Festival",
    action: "Cancel",
  },
  {
    id: "6",
    dateTime: "2024-01-10 19:00:00",
    username: "emily_davis",
    concertName: "Rock Festival 2024",
    action: "Reserve",
  },
  {
    id: "7",
    dateTime: "2024-01-09 21:15:00",
    username: "chris_taylor",
    concertName: "Jazz Night Live",
    action: "Cancel",
  },
  {
    id: "8",
    dateTime: "2024-01-08 15:45:00",
    username: "amanda_martinez",
    concertName: "Symphony Orchestra",
    action: "Reserve",
  },
];

const HistoryPage = () => {
  return (
    <MainLayout>
      <HistoryTable data={mockHistoryData} />
    </MainLayout>
  );
};

export default HistoryPage;
