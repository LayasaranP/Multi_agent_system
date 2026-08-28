"use client";

import React from "react";
import { Icon as IconifyIcon, IconProps as IconifyProps } from "@iconify/react";
import { cn } from "@/lib/utils";

export interface IconProps extends Omit<IconifyProps, "ref"> {
  className?: string;
  size?: number | string;
}

export function Icon({ icon, className, size = 18, ...props }: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      className={cn("inline-block shrink-0 align-middle", className)}
      style={{ fontSize: size }}
      {...props}
    />
  );
}
