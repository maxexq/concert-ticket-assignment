"use client";

import React, { useState } from "react";
import { Button } from "../atoms";
import { Divider } from "@mui/material";
import { User, Pencil, Trash2, X, Save } from "lucide-react";

export type ConcertCardType = "reserve" | "cancel" | "delete" | "edit";

interface IConcertCardProps {
  id: string;
  name: string;
  description: string;
  seats: number;
  type?: ConcertCardType;
  onReserve?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSave?: (
    id: string,
    data: { name: string; description: string; seats: number },
  ) => void;
}

const ConcertCard = (props: IConcertCardProps) => {
  const {
    id,
    name,
    description,
    seats,
    type = "reserve",
    onReserve,
    onCancel,
    onDelete,
    onSave,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name, description, seats });

  const handleSave = () => {
    onSave?.(id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({ name, description, seats });
    setIsEditing(false);
  };

  const renderActions = () => {
    switch (type) {
      case "reserve":
        return (
          <Button title="Reserve" size="lg" onClick={() => onReserve?.(id)} />
        );

      case "cancel":
        return (
          <Button
            title="Cancel"
            size="lg"
            variant="danger"
            onClick={() => onCancel?.(id)}
          />
        );

      case "delete":
        return (
          <Button
            title="Delete"
            size="lg"
            variant="danger"
            icon={Trash2}
            onClick={() => onDelete?.(id)}
          />
        );

      case "edit":
        if (isEditing) {
          return (
            <div className="flex gap-2">
              <Button
                title="Cancel"
                size="lg"
                variant="warning"
                icon={X}
                onClick={handleCancelEdit}
              />
              <Button
                title="Save"
                size="lg"
                variant="success"
                icon={Save}
                onClick={handleSave}
              />
            </div>
          );
        }
        return (
          <div className="flex gap-2">
            <Button
              title="Edit"
              size="lg"
              variant="info"
              icon={Pencil}
              onClick={() => setIsEditing(true)}
            />
            <Button
              title="Delete"
              size="lg"
              variant="danger"
              icon={Trash2}
              onClick={() => onDelete?.(id)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center p-10 rounded-lg border border-[#C2C2C2] w-full gap-8">
      <div className="flex flex-col gap-6">
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="text-[40px] font-semibold text-[#1692EC] border border-[#C2C2C2] rounded-md px-2 py-1 outline-none focus:border-[#1692EC]"
          />
        ) : (
          <h2 className="text-[40px] font-semibold text-[#1692EC]">{name}</h2>
        )}
        <Divider orientation="horizontal" className="border-[#C2C2C2]!" />
        {isEditing ? (
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="text-2xl font-normal border border-[#C2C2C2] rounded-md px-2 py-1 outline-none focus:border-[#1692EC] min-h-[100px]"
          />
        ) : (
          <p className="text-2xl font-normal">{description}</p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold inline-flex gap-1 items-center">
          <User className="w-8 h-8" />
          {isEditing ? (
            <input
              type="number"
              value={editData.seats}
              onChange={(e) =>
                setEditData({ ...editData, seats: Number(e.target.value) })
              }
              className="text-2xl font-normal border border-[#C2C2C2] rounded-md px-2 py-1 w-32 outline-none focus:border-[#1692EC]"
            />
          ) : (
            <span className="text-2xl font-normal">
              {seats.toLocaleString()}
            </span>
          )}
        </div>
        {renderActions()}
      </div>
    </div>
  );
};

export default React.memo(ConcertCard);
