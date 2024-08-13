export function sanitizeCpf(cpf: string): string {
  if (/^\d+$/.test(cpf)) {
    return cpf;
  }

  return cpf.replace(/\D+/g, "");
}
