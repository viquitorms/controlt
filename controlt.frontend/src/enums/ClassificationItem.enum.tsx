import { StatusItemEnum } from "./StatusItem.enum";

export const ActionableClassificationEnum = {
    FazerAgora: StatusItemEnum.EmAndamento,      // < 2 minutos → "Em Andamento"
    Delegar: StatusItemEnum.Aguardando,          // Delegar → "Aguardando"
    Agendar: StatusItemEnum.Agendada,            // Agendar → "Agendada"
    Projeto: StatusItemEnum.Projeto,             // Projeto → "Projeto" (depois converte)
    ProximaAcao: StatusItemEnum.ProximaAcao,     // Próxima ação → "Próxima Ação"
} as const;

export const NonActionableClassificationEnum = {
    Lixo: StatusItemEnum.Arquivada,              // Descartar → "Arquivada"
    Referencia: StatusItemEnum.Referencia,       // Referência → "Referência"
    AlgumDia: StatusItemEnum.AlgumDia,           // Algum dia → "Algum Dia"
} as const;

export type ActionableClassification = typeof ActionableClassificationEnum[keyof typeof ActionableClassificationEnum];
export type NonActionableClassification = typeof NonActionableClassificationEnum[keyof typeof NonActionableClassificationEnum];