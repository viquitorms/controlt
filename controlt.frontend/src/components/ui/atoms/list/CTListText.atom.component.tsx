import { ListItem, ListItemText } from "@mui/material";

export interface ICTListText {
    id?: string | number;
    text?: string;
    secondary?: string;
    className?: string;
    dense?: boolean;
}

export default function CTListText(props: ICTListText) {
    return (
        <ListItem key={props.id} className={props.className} dense={props.dense}>
            <ListItemText primary={props.text} secondary={props.secondary} />
        </ListItem>
    );
}

