import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../shared/utils/jwt.js";
import { RefreshTokenModel } from "../../../DB/models/user/auth.model.js";
import type { AuthTokens } from "../auth.types.js";

export async function createSession(
  userId: string,
  roleId: string,
): Promise<AuthTokens> {
  const accessToken = generateAccessToken({ userId, roleId });
  const refreshToken = generateRefreshToken({ userId, roleId });

  const payload = verifyRefreshToken(refreshToken);
  await RefreshTokenModel.create({
    userId,
    token: refreshToken,
    expiresAt: new Date(payload.exp * 1000),
  });

  return { accessToken, refreshToken };
}
