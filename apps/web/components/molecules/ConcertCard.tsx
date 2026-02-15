"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, Input } from "../atoms";
import { Divider } from "@mui/material";
import { User, Pencil, Trash2, X, Save } from "lucide-react";

export type ConcertCardType =
  | "reserve"
  | "cancel"
  | "delete"
  | "edit"
  | "create";

interface IConcertFormData {
  name: string;
  description: string;
  seats: number;
}

interface IConcertCardProps {
  id?: string;
  name?: string;
  description?: string;
  seats?: number;
  type?: ConcertCardType;
  onReserve?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSave?: (id: string, data: IConcertFormData) => void;
  onCreate?: (data: IConcertFormData) => void;
}

const ConcertCard = (props: IConcertCardProps) => {
  const {
    id = "",
    name = "",
    description = "",
    seats = 0,
    type = "reserve",
    onReserve,
    onCancel,
    onDelete,
    onSave,
    onCreate,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const isCreateMode = type === "create";
  const showForm = isEditing || isCreateMode;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IConcertFormData>({
    defaultValues: { name, description, seats },
  });

  const onSubmit = (data: IConcertFormData) => {
    if (isCreateMode) {
      alert(JSON.stringify(data, null, 2));
      onCreate?.(data);
      toast.success("Concert created successfully!");
      reset({ name: "", description: "", seats: 0 });
    } else {
      onSave?.(id, data);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    reset({ name, description, seats });
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
                type="submit"
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

      case "create":
        return (
          <Button
            title="Save"
            size="lg"
            variant="success"
            icon={Save}
            type="submit"
          />
        );

      default:
        return null;
    }
  };

  const cardContent = (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="text-[40px] font-semibold text-[#1692EC]">
          {showForm ? "Create" : name}
        </h2>
        <Divider orientation="horizontal" className="border-[#C2C2C2]!" />
        {showForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Concert Name"
              type="text"
              placeholder="Please input concert name"
              register={register("name", {
                required: "Concert name is required",
              })}
              error={errors.name?.message}
            />
            <Input
              label="Total of seat"
              type="number"
              placeholder="Please input total of seats"
              postIcon={User}
              register={register("seats", {
                required: "Total seats is required",
                valueAsNumber: true,
                min: { value: 1, message: "Seats must be at least 1" },
              })}
              error={errors.seats?.message}
            />
            <Input
              label="Description"
              type="textarea"
              placeholder="Please input description"
              className="col-span-1 md:col-span-2"
              rows={4}
              register={register("description", {
                required: "Description is required",
              })}
              error={errors.description?.message}
            />
          </div>
        ) : (
          <>
            <p className="text-2xl font-normal">{description}</p>
          </>
        )}
      </div>
      <div className="flex justify-between items-center">
        {!showForm && (
          <div className="text-xl font-semibold inline-flex gap-1 items-center">
            <User className="w-8 h-8" />
            <span className="text-2xl font-normal">
              {seats.toLocaleString()}
            </span>
          </div>
        )}
        <div className={showForm ? "ml-auto" : ""}>{renderActions()}</div>
      </div>
    </>
  );

  if (showForm) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center p-10 rounded-lg border border-[#C2C2C2] w-full gap-8"
      >
        {cardContent}
      </form>
    );
  }

  return (
    <div className="flex flex-col justify-center p-10 rounded-lg border border-[#C2C2C2] w-full gap-8">
      {cardContent}
    </div>
  );
};

export default React.memo(ConcertCard);
