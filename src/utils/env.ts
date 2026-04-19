import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  override: true,
});

const parsePort = (value: string | undefined): number => {
  const fallbackPort = 3000;
  const parsed = Number(value);

  if (!value || Number.isNaN(parsed)) {
    return fallbackPort;
  }

  return parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d"
};
