
export enum View {
  LoginEmail,
  LoginPassword,
  FirstTimeLogin,
  Setup2FA,
  Verify2FAAuthenticator,
  Verify2FAPin,
  Verify2FASMS,
  ForgotPassword,
  ForgotPin,
  UpdatePhoneNumber,
  AccountLocked,
  TempPasswordExpired,
  Dashboard,
  ResetPassword,
  ResetPasswordSuccess,
  Help,
  Redirecting,
  SystemStatus
}

export enum TwoFactorMethod {
  Pin,
  SMS,
  Authenticator
}

export interface User {
    password: string;
    has2FA: boolean;
    twoFactorMethod?: TwoFactorMethod;
    isNew?: boolean;
    isLocked?: boolean;
    tempPasswordExpiresAt?: Date;
}
