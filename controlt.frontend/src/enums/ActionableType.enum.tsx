export const EnumActionableType = {
    EmAndamento: 1,
    ProximaAcao: 2,
    Agendada: 3,
    Aguardando: 4,
    Projeto: 9,

} as const;

export type EnumActionableType = typeof EnumActionableType[keyof typeof EnumActionableType];

export const EnumActionableTypeName: Record<number, string> = {
    [EnumActionableType.EmAndamento]: "Em Andamento",
    [EnumActionableType.ProximaAcao]: "Próxima Ação",
    [EnumActionableType.Agendada]: "Agendada",
    [EnumActionableType.Aguardando]: "Aguardando",
    [EnumActionableType.Projeto]: "Projeto",
};