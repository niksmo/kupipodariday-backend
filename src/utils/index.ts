export function specifyMessage(message: string) {
  return { message };
}
export function roundToHundredths(value: number) {
  return Math.round(value * 100) / 100;
}

export function isEmptyBody<T extends object>(body: T) {
  return Object.keys(body).length === 0;
}
