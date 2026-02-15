import type { LucideIcon } from "lucide-react";
import React from "react";

export interface IStatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  bgColor?: string;
}

const StatCard = (props: IStatCardProps) => {
  const { icon: Icon, title, value, bgColor = "#0070A4" } = props;

  return (
    <div
      className="text-white  rounded-lg py-6 px-4 flex flex-col items-center justify-center gap-2.5 w-full"
      style={{ backgroundColor: bgColor }}
    >
      <Icon className="w-10 h-10" />
      <div className="text-2xl font-normal">{title}</div>
      <div className="text-6xl font-normal">{value}</div>
    </div>
  );
};

export default React.memo(StatCard);
