import { Chip } from "@mui/material";
import { StatusItemEnum, StatusItemName } from "../enums/StatusItem.enum";

interface IItemStatusChip {
    statusId: number;
}

export default function ItemStatusChip({ statusId }: IItemStatusChip) {
    const getColor = (id: number) => {
        switch (id) {
            case StatusItemEnum.Inbox:
                return "default";
            case StatusItemEnum.ProximaAcao:
                return "primary";
            case StatusItemEnum.EmAndamento:
                return "warning";
            case StatusItemEnum.Aguardando:
                return "info";
            case StatusItemEnum.Agendada:
                return "secondary";
            case StatusItemEnum.Concluida:
                return "success";
            case StatusItemEnum.Arquivada:
            case StatusItemEnum.Cancelada:
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Chip
            label={StatusItemName[statusId]}
            color={getColor(statusId)}
            size="small"
        />
    );
}