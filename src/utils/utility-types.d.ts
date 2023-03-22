/**
 * Make property K in T optional
 */
type Optional<T, K extends keyof T> = Partial<T> & Omit<T, K>;
