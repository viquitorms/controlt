import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export interface ICTListButton {
  id?: string | number;
  label?: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
  dense?: boolean;
}

export default function CTListButton(props: ICTListButton) {
  return (
    <ListItem key={props.id} className={props.className} disablePadding dense={props.dense}>
      <ListItemButton onClick={props.onClick} disabled={props.disabled}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.label} />
      </ListItemButton>
    </ListItem>
  );
}