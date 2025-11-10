export function merge<T>(base: T[], extras?: T[]): T[] {
    if (!extras || extras.length === 0) return base;
    return [...base, ...extras];
}