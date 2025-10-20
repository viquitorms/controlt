export const StatusItemEnum = {
    Inbox: 1,
    Processando: 2,
    ProximaAcao: 3,
    EmAndamento: 4,
    Aguardando: 5,
    Agendada: 6,
    AlgumDia: 7,
    Concluida: 8,
    Cancelada: 9,
    Arquivada: 10,
    Bloqueada: 11,
    EmRevisao: 12,
    Referencia: 13,
    Projeto: 14,
} as const;

export type StatusItemEnumValue = typeof StatusItemEnum[keyof typeof StatusItemEnum];

export const StatusItemName: Record<number, string> = {
    1: "Inbox",
    2: "Processando",
    3: "Próxima Ação",
    4: "Em Andamento",
    5: "Aguardando",
    6: "Agendada",
    7: "Algum Dia",
    8: "Concluída",
    9: "Cancelada",
    10: "Arquivada",
    11: "Bloqueada",
    12: "Em Revisão",
    13: "Referência",
    14: "Projeto",
};

export const getStatusName = (status_id: number): string => {
    return StatusItemName[status_id] || "Status Desconhecido";
};