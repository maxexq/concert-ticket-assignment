"use client";

import { MainLayout } from "@/components/layout";
import {
  HistoryTable,
  IHistoryRecord,
  HistoryAction,
} from "@/components/molecules";
import { useMyHistory, useHistory } from "@/hooks";
import { useRole } from "@/contexts";

const HistoryPage = () => {
  const { role } = useRole();
  const isAdmin = role === "admin";

  const { data: myHistoryData, isLoading: isMyHistoryLoading } = useMyHistory();
  const { data: allHistoryData, isLoading: isAllHistoryLoading } = useHistory();

  const historyData = isAdmin ? allHistoryData : myHistoryData;
  const isLoading = isAdmin ? isAllHistoryLoading : isMyHistoryLoading;

  const records: IHistoryRecord[] =
    historyData?.map((record) => ({
      id: record.id,
      dateTime: new Date(record.dateTime).toLocaleString(),
      username: record.username,
      concertName: record.concertName,
      action: (record.action === "reserve"
        ? "Reserve"
        : "Cancel") as HistoryAction,
    })) ?? [];

  return (
    <MainLayout>
      {isLoading ? (
        <div>Loading history...</div>
      ) : (
        <HistoryTable data={records} />
      )}
    </MainLayout>
  );
};

export default HistoryPage;
