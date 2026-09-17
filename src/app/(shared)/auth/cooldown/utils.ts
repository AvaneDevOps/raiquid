export function splitName(fullName: string): { firstName: string; lastName?: string } {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return rest.length ? { firstName, lastName: rest.join(" ") } : { firstName };
}
