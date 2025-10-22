export function getUserEmail(): string {
  const envEmail = process.env.NEXT_PUBLIC_USER_EMAIL?.trim();
  if (envEmail) return envEmail;

  if (typeof window !== "undefined") {
    const ls = window.localStorage.getItem("userEmail")?.trim();
    if (ls) return ls;
  }

  return "rohit.gandham@infodatinc.com";
}