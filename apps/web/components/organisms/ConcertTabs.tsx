"use client";

import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ConcertCard from "../molecules/ConcertCard";
import { ConfirmModal } from "../molecules";
import ConcertOverview, { IConcert } from "./ConcertOverview";
import { useConcerts, useCreateConcert, useDeleteConcert } from "@/hooks";
import { notify, handleMutationError } from "@/lib";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`concert-tabpanel-${index}`}
      aria-labelledby={`concert-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ConcertTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    concertId: string;
    concertName: string;
  }>({ open: false, concertId: "", concertName: "" });

  const { data: concertsData, isLoading } = useConcerts();
  const createConcert = useCreateConcert();
  const deleteConcert = useDeleteConcert();

  const concerts: IConcert[] =
    concertsData?.map((concert) => ({
      id: concert.id,
      name: concert.name,
      description: concert.description,
      seats: concert.seat,
      status: "delete" as const,
    })) ?? [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = (id: string) => {
    const concert = concerts.find((c) => c.id === id);
    if (concert) {
      setDeleteModal({
        open: true,
        concertId: id,
        concertName: concert.name,
      });
    }
  };

  const handleDeleteConfirm = () => {
    deleteConcert.mutate(deleteModal.concertId, {
      onSuccess: () => {
        notify.success("Delete successfully");
        setDeleteModal({ open: false, concertId: "", concertName: "" });
      },
      onError: handleMutationError,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, concertId: "", concertName: "" });
  };

  const handleCreate = (data: {
    name: string;
    description: string;
    seats: number;
  }) => {
    createConcert.mutate(
      { name: data.name, description: data.description, seat: data.seats },
      {
        onSuccess: () => {
          notify.success("Create successfully");
          setTabValue(0);
        },
        onError: handleMutationError,
      },
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="concert tabs"
          sx={{
            "& .MuiTab-root": {
              fontSize: "24px",
              fontWeight: 400,
              fontStyle: "normal",
              textTransform: "none",
              color: "#5C5C5C",
            },
            "& .Mui-selected": {
              color: "#1692EC",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1692EC",
            },
          }}
        >
          <Tab
            label="Overview"
            id="concert-tab-0"
            aria-controls="concert-tabpanel-0"
          />
          <Tab
            label="Create"
            id="concert-tab-1"
            aria-controls="concert-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <div>Loading concerts...</div>
        ) : (
          <ConcertOverview
            cardType="delete"
            concerts={concerts}
            onDelete={handleDeleteClick}
          />
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ConcertCard type="create" onCreate={handleCreate} />
      </TabPanel>

      <ConfirmModal
        open={deleteModal.open}
        type="danger"
        title="Are you sure to delete?"
        message={deleteModal.concertName}
        cancelText="Cancel"
        confirmText="Yes, Delete"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default React.memo(ConcertTabs);
