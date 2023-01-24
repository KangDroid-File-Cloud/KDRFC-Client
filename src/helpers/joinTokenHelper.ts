import { AuthenticationProvider } from '../apis';

export class JoinTokenHelper {
  static createJoinTokenFromJwt(joinToken: string): JoinToken {
    const payloadBase64 = joinToken.split('.')[1];
    const payloadObject: JoinToken = JSON.parse(atob(payloadBase64));
    payloadObject.token = joinToken;
    return payloadObject;
  }
}

export interface JoinToken {
  sub: string;
  email: string;
  provider: AuthenticationProvider;
  token: string;
}
