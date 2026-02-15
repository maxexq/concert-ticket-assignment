import React from "react";
import StatCard, { IStatCardProps } from "../atoms/StatCard";

export interface IStatsGroupProps {
  stats: IStatCardProps[];
}

const StatsGroup = (props: IStatsGroupProps) => {
  const { stats } = props;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(StatsGroup);
