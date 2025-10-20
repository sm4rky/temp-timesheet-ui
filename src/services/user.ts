export function getUserEmail(): string {
  // TEMP: source from env or hardcode during dev
  // 1) preferred: set NEXT_PUBLIC_USER_EMAIL in .env.local
  if (process.env.NEXT_PUBLIC_USER_EMAIL) return process.env.NEXT_PUBLIC_USER_EMAIL;

  // 2) fallback dev user
  return "rohit.gandham@infodatinc.com";
}
