export function specifyMessage(message: string) {
  return { message };
}
export function roundToHundredths(value: number) {
  return Math.round(value * 100) / 100;
}
