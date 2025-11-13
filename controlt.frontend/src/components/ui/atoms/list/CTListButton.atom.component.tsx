import React from "react";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface ICTListButton {
  id?: string | number;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
  dense?: boolean;
}

export default function CTListButton(props: ICTListButton) {
  return (
    <ListItem key={props.id} className={props.className} disablePadding dense={props.dense}>
      <ListItemButton onClick={props.onClick} disabled={props.disabled}>
        <ListItemText primary={props.label} />
      </ListItemButton>
    </ListItem>
  );
}