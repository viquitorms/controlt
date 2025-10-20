export const ProfileEnum = {
    GERENTE: 1,
    COLABORADOR: 2
} as const;

export type ProfileEnumValue = typeof ProfileEnum[keyof typeof ProfileEnum];