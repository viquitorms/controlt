import React from "react";
import { List } from "@mui/material";
import CTListText from "../atoms/list/CTListText.atom.component";
import CTListButton from "../atoms/list/CTListButton.atom.component";

type TextItem = { type: "text"; id: string | number; text: string; secondary?: string };
type ButtonItem = { type: "button"; id: string | number; label: string; onClick?: () => void; disabled?: boolean };

export type CTListItem = TextItem | ButtonItem;

interface CTListProps {
    items: CTListItem[];
    className?: string;
}

export default function CTList({ items, className }: CTListProps) {
    return (
        <List className={className}>
            {items.map((item) => {
                if (item.type === "text") {
                    return (
                        <CTListText
                            key={item.id}
                            id={item.id}
                            text={item.text}
                            secondary={item.secondary}
                        />
                    );
                }
                if (item.type === "button") {
                    return (
                        <CTListButton
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            onClick={(e) => {
                                item.onClick?.();
                            }}
                            disabled={item.disabled}
                        />
                    );
                }
                return null;
            })}
        </List>
    );
}