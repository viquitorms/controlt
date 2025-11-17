export const EnumActionableType = {
    FazerAgora: 1,      // Em Andamento
    Delegar: 2,         // Delegar
    Agendar: 3,         // Agendar
    Projeto: 4,         // Projeto
    ProximaAcao: 5,     // Próxima ação
} as const;

export type EnumActionableType = typeof EnumActionableType[keyof typeof EnumActionableType];
