"use client";

import React, { useState } from "react";
import { Button, Input } from "../atoms";
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
        <h2 className="text-[40px] font-semibold text-[#1692EC]">
          {isEditing ? "Create" : name}
        </h2>
        <Divider orientation="horizontal" className="border-[#C2C2C2]!" />
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Concert Name"
              type="text"
              value={editData.name}
              onChange={(value) =>
                setEditData({ ...editData, name: String(value) })
              }
              placeholder="Please input concert name"
            />
            <Input
              label="Total of seat"
              type="number"
              value={editData.seats}
              onChange={(value) =>
                setEditData({ ...editData, seats: Number(value) })
              }
              placeholder="Please input total of seats"
              postIcon={User}
            />
            <Input
              label="Description"
              type="textarea"
              value={editData.description}
              onChange={(value) =>
                setEditData({ ...editData, description: String(value) })
              }
              placeholder="Please input description"
              className="col-span-1 md:col-span-2"
              rows={4}
            />
          </div>
        ) : (
          <>
            <p className="text-2xl font-normal">{description}</p>
          </>
        )}
      </div>
      <div className="flex justify-between items-center">
        {!isEditing && (
          <div className="text-xl font-semibold inline-flex gap-1 items-center">
            <User className="w-8 h-8" />
            <span className="text-2xl font-normal">
              {seats.toLocaleString()}
            </span>
          </div>
        )}
        <div className={isEditing ? "ml-auto" : ""}>{renderActions()}</div>
      </div>
    </div>
  );
};

export default React.memo(ConcertCard);
