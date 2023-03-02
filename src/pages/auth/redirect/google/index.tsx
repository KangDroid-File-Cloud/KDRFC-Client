import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthenticationProvider, JoinTokenResponse } from '../../../../apis';
import { accountApi } from '../../../../App';
import { LocalStorageHelper } from '../../../../helpers/localStorageHelper';

function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParameters] = useSearchParams();

  useEffect(() => {
    const googleOAuthCode = searchParameters.get('code');
    handleOAuthAccount(AuthenticationProvider.Google, googleOAuthCode!);
  }, []);

  // Common OAuth Login Handler
  async function handleOAuthAccount(provider: AuthenticationProvider, oAuthCode: string) {
    try {
      const response = await accountApi.loginAccount({
        authenticationProvider: provider,
        authCode: oAuthCode
      });

      LocalStorageHelper.setItem('accessToken', response.data.accessToken);
      LocalStorageHelper.setItem('refreshToken', response.data.refreshToken);
      navigate('/');
    } catch (error) {
      handleLoginError(error);
    }
  }

  // Login Error Handler(redirecting to join)
  const handleLoginError = (error: unknown) => {
    // Case 1. Error is not axios error.
    if (!axios.isAxiosError(error)) throw error;

    // Case 2. OAuth user does not exists.
    if (error.response?.status === 404) {
      // 1. Parse Join Token
      const { joinToken } = error.response.data as JoinTokenResponse;

      // 2. Navigate to join page.(TODO: Properly create join page)
      navigate('/join', { state: joinToken });
    }
  };
  return <div>.</div>;
}

export default GoogleOAuthCallback;
