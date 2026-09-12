import jwt from "jsonwebtoken";

export function verifyToken(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token)
    return response.status(401).json({ error: "Token não informado." });
  try {
    request.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-only-secret",
    );
    return next();
  } catch {
    return response.status(401).json({ error: "Token inválido ou expirado." });
  }
}
