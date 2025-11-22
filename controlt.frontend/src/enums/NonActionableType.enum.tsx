export const EnumNonActionableType = {
    Concluida: 5,
    AlgumDia: 6,
    Referencia: 7,
    Arquivada: 8
} as const;

export type EnumNonActionableType = typeof EnumNonActionableType[keyof typeof EnumNonActionableType];

export const EnumNonActionableTypeName: Record<number, string> = {
    [EnumNonActionableType.Concluida]: "Concluída",
    [EnumNonActionableType.AlgumDia]: "Algum Dia",
    [EnumNonActionableType.Referencia]: "Referência",
    [EnumNonActionableType.Arquivada]: "Arquivada",
};