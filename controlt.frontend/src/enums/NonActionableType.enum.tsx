export const EnumNonActionableType = {
    Lixo: 1,             // Arquivado
    Referencia: 2,       // Referência
    AlgumDia: 3          // Algum dia
} as const;

export type EnumNonActionableType = typeof EnumNonActionableType[keyof typeof EnumNonActionableType];