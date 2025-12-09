import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { forgotPassword, login, register, resetPassword, sendVerification, verifyUserEmail } from "../controllers/auth.controller.js";
import { authGuard } from "../middlewares/authguard.js";

const authRouter = new Hono()

authRouter.post(
  "/register", zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8),
      firstname: z.string().min(2),
      lastname: z.string().min(2),
    })
  ),
  register
);

authRouter.post(
  "/login",
  zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8),
    })
  ),
  login
);

authRouter.post(
  "/forgot-password",
  zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
    })
  ),
  forgotPassword
);

authRouter.post(
  "/reset-password",
  zValidator('json',
    z.object({
      token: z.string(),
      password: z.string().min(8),
    })
  ),
  resetPassword
);

authRouter.post(
  "/send-verification",
  zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
    })
  ),
  sendVerification
);

authRouter.get(
  "/verify/:token",
  verifyUserEmail
);

authRouter.get(
  "/me",
  authGuard(),
  (c) => {
    const user = c.get("user");
    return c.json(user);
  }
);


export default authRouter;
