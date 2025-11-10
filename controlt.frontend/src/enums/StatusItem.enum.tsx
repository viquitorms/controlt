export const StatusItemEnum = {
    ProximaAcao: 1,
    EmAndamento: 2,
    Aguardando: 3,
    Agendada: 4,
    AlgumDia: 5,
    Concluida: 6,
    Cancelada: 7,
    Arquivada: 8,
    Bloqueada: 9,
    EmRevisao: 10,
    Referencia: 11,
    Projeto: 12,
} as const;

export type StatusItemEnumValue = typeof StatusItemEnum[keyof typeof StatusItemEnum];

export const StatusItemName: Record<number, string> = {
    [StatusItemEnum.ProximaAcao]: "Próxima Ação",
    [StatusItemEnum.EmAndamento]: "Em Andamento",
    [StatusItemEnum.Aguardando]: "Aguardando",
    [StatusItemEnum.Agendada]: "Agendada",
    [StatusItemEnum.AlgumDia]: "Algum Dia",
    [StatusItemEnum.Concluida]: "Concluída",
    [StatusItemEnum.Cancelada]: "Cancelada",
    [StatusItemEnum.Arquivada]: "Arquivada",
    [StatusItemEnum.Bloqueada]: "Bloqueada",
    [StatusItemEnum.EmRevisao]: "Em Revisão",
    [StatusItemEnum.Referencia]: "Referência",
    [StatusItemEnum.Projeto]: "Projeto",
};

export const getStatusName = (status_id: number): string => {
    return StatusItemName[status_id] || "Status Desconhecido";
};