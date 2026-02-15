"use client";

import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ConcertCard from "../molecules/ConcertCard";
import { ConfirmModal } from "../molecules";
import ConcertOverview, { IConcert } from "./ConcertOverview";

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

export const mockConcerts: IConcert[] = [
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
    status: "cancel",
  },
];

const ConcertTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    concertId: string;
    concertName: string;
  }>({ open: false, concertId: "", concertName: "" });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReserve = (id: string) => {
    console.log("Reserve concert:", id);
  };

  const handleDeleteClick = (id: string) => {
    const concert = mockConcerts.find((c) => c.id === id);
    if (concert) {
      setDeleteModal({
        open: true,
        concertId: id,
        concertName: concert.name,
      });
    }
  };

  const handleDeleteConfirm = () => {
    console.log("Delete concert confirmed:", deleteModal.concertId);
    setDeleteModal({
      open: false,
      concertId: "",
      concertName: deleteModal.concertName,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      open: false,
      concertId: "",
      concertName: deleteModal.concertName,
    });
  };

  const handleSave = (
    id: string,
    data: { name: string; description: string; seats: number },
  ) => {
    console.log("Save concert:", id, data);
  };

  const handleCreate = (data: {
    name: string;
    description: string;
    seats: number;
  }) => {
    console.log("Create concert:", data);
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
        <ConcertOverview
          cardType="delete"
          concerts={mockConcerts}
          onReserve={handleReserve}
          onDelete={handleDeleteClick}
          onSave={handleSave}
        />
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
