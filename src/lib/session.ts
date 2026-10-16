import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "rns_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function key(secret = process.env.AUTH_SECRET ?? "") {
  if (secret.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(secret);
}

export async function signSession(userId: string, secret?: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key(secret));
}

/** Returns the user id for a valid token, otherwise null. Never throws. */
export async function verifySession(token: string | undefined | null, secret?: string): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    return payload.role === "admin" && typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
