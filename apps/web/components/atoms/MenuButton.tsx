"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export enum MenuButtonType {
  LINK = "link",
  BUTTON = "button",
  EXTERNAL = "external",
}

export interface IMenuButtonProps {
  title: string;
  href?: string;
  icon?: LucideIcon;
  type?: MenuButtonType;
  onClick?: () => void;
}

const MenuButton = (props: IMenuButtonProps) => {
  const {
    title,
    href = "#",
    icon: Icon,
    type = MenuButtonType.LINK,
    onClick,
  } = props;

  const pathname = usePathname();
  const isActive = pathname === href;

  const baseStyles = `
    flex items-center gap-2.5 w-full px-2 py-4 rounded-md
    transition-colors text-sm font-medium
    ${isActive ? "bg-[#EAF5F9]" : "hover:bg-[#EAF5F9]"}
  `;

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{title}</span>
    </>
  );

  switch (type) {
    case MenuButtonType.LINK:
      return (
        <Link href={href} className={baseStyles} onClick={onClick}>
          {content}
        </Link>
      );

    case MenuButtonType.BUTTON:
      return (
        <button type="button" className={`${baseStyles} cursor-pointer`} onClick={onClick}>
          {content}
        </button>
      );

    case MenuButtonType.EXTERNAL:
      return (
        <a
          href={href}
          className={baseStyles}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {content}
        </a>
      );

    default:
      return (
        <Link href={href} className={baseStyles} onClick={onClick}>
          {content}
        </Link>
      );
  }
};

export default React.memo(MenuButton);
