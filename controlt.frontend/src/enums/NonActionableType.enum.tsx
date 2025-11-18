export const EnumNonActionableType = {
    Arquivada: 1,             // Arquivado
    Referencia: 2,       // Referência
    AlgumDia: 3          // Algum dia
} as const;

export type EnumNonActionableType = typeof EnumNonActionableType[keyof typeof EnumNonActionableType];

export const EnumNonActionableTypeName: Record<number, string> = {
    [EnumNonActionableType.Arquivada]: "Arquivada",
    [EnumNonActionableType.Referencia]: "Referência",
    [EnumNonActionableType.AlgumDia]: "Algum Dia"
};

export const getStatusName = (status_id: number): string => {
    return EnumNonActionableTypeName[status_id] || "Status Desconhecido";
};