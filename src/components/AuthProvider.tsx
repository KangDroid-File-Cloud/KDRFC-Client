import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessTokenPayload, parseJwtPayload } from '../helpers/jwtHelper';
import { LocalStorageHelper } from '../helpers/localStorageHelper';

interface ReactChild {
  children: ReactNode;
}

function AuthProvider({ children }: ReactChild) {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  // Get Access Token
  const accessToken = LocalStorageHelper.getItem('accessToken');
  useEffect(() => {
    // Case 1. Make sure AccessToken exists on Local Storage.
    if (!accessToken) {
      navigate('/login');
    } else {
      // Case 2. Make sure accessToken's exp is valid.
      const jwtData = parseJwtPayload<AccessTokenPayload>(accessToken!);

      // Setup EXP Epoch Timestamp
      const exp = new Date(0);
      exp.setUTCSeconds(jwtData.exp);
      const jsParsedExp = Date.parse(exp.toISOString());

      // Setup Current Timestamp
      const jsParsedCurrent = Date.parse(new Date().toISOString());

      // Current Time is greater than JWT's EXP Field. Refresh/Login again.
      if (jsParsedExp <= jsParsedCurrent) {
        navigate('/login');
      }
    }
    setIsValidating(false);
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{!isValidating && children}</>;
}

export default AuthProvider;
