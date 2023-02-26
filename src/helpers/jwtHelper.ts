export interface AccessTokenPayload {
  sub: string;
  nickname: string;
  email: string;
  rootid: string;
  exp: number;
}

export function parseJwtPayload<T>(jwt: string) {
  const payloadBase64 = jwt.split('.')[1];
  const payloadObject: T = JSON.parse(atob(payloadBase64));

  return payloadObject;
}
