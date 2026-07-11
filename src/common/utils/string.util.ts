export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (localPart.length <= 4) {
    return `${localPart.charAt(0)}***${localPart.charAt(localPart.length - 1)}@${domain}`;
  }

  const visibleStart = 3;
  const visibleEnd = 2;

  const start = localPart.substring(0, visibleStart);
  const end = localPart.substring(localPart.length - visibleEnd);

  return `${start}***${end}@${domain}`;
}
