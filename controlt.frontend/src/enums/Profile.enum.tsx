export const ProfileEnum = {
    Gerente: 1,
    Colaborador: 2
} as const;

export type ProfileEnumValue = typeof ProfileEnum[keyof typeof ProfileEnum];