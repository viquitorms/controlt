export const EnumActionableType = {
    EmAndamento: 1,      // Em Andamento
    Aguardando: 2,         // Delegar
    Agendada: 3,         // Agendar
    Projeto: 4,         // Projeto
    ProximaAcao: 5,     // Próxima ação
} as const;

export type EnumActionableType = typeof EnumActionableType[keyof typeof EnumActionableType];

export const EnumActionableTypeName: Record<number, string> = {
    [EnumActionableType.EmAndamento]: "Em Andamento",
    [EnumActionableType.Aguardando]: "Aguardando",
    [EnumActionableType.Agendada]: "Agendada",
    [EnumActionableType.Projeto]: "Projeto",
    [EnumActionableType.ProximaAcao]: "Próxima Ação",
};

export const getStatusName = (status_id: number): string => {
    return EnumActionableTypeName[status_id] || "Status Desconhecido";
};