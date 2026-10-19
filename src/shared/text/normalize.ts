const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function normalizeText(value: string): string {
  return value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARACTERS, '').trim();
}
