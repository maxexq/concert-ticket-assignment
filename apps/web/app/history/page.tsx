"use client";

import React from "react";
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

  const {
    data: myHistoryData,
    isLoading: isMyHistoryLoading,
    refetch: refetchMyHistory,
  } = useMyHistory({ enabled: !isAdmin });

  const {
    data: allHistoryData,
    isLoading: isAllHistoryLoading,
    refetch: refetchAllHistory,
  } = useHistory({ enabled: isAdmin });

  const historyData = isAdmin ? allHistoryData : myHistoryData;
  const isLoading = isAdmin ? isAllHistoryLoading : isMyHistoryLoading;

  React.useEffect(() => {
    if (isAdmin) {
      refetchAllHistory();
    } else {
      refetchMyHistory();
    }
  }, [isAdmin, refetchAllHistory, refetchMyHistory]);

  const records: IHistoryRecord[] =
    historyData?.map((record) => ({
      id: record.id,
      dateTime: record.dateTime,
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
