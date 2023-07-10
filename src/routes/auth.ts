import {Router} from "express";
import {loginValidation} from "../middlewares/login-middleware";
import {jwtMiddleware} from "../middlewares/auth-jwt-middleware";
import {
    codeConfirmationValidation,
    emailValidationResending, newPasswordValidation,
    userValidationByRegistration
} from "../middlewares/user-middleware";
import {errorsValidationMiddleware} from "../middlewares/err-middleware";
import {jwtRefreshMiddleware} from "../middlewares/auth-refresh-middleware";
import {rateLimitsMiddleware} from "../middlewares/rateLimits-middleware";
import {authController} from "../composition-root";


export const authRouter = Router()


authRouter.post('/login',
    loginValidation,
    authController.login.bind(authController))

authRouter.post('/refresh-token',
    jwtRefreshMiddleware,
    authController.refreshToken.bind(authController))

authRouter.post('/logout',
    jwtRefreshMiddleware,
    authController.logout.bind(authController))


authRouter.get('/me',
    jwtMiddleware,
    authController.me.bind(authController))

authRouter.post('/registration',
    userValidationByRegistration,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    rateLimitsMiddleware,
    codeConfirmationValidation,
    errorsValidationMiddleware,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    rateLimitsMiddleware,
    emailValidationResending,
    errorsValidationMiddleware,
    authController.registrationEmailResending.bind(authController))


authRouter.post('/password-recovery',
    rateLimitsMiddleware,
    emailValidationResending,
    errorsValidationMiddleware,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    rateLimitsMiddleware,
    newPasswordValidation,
    errorsValidationMiddleware,
    authController.newPassword.bind(authController)
)