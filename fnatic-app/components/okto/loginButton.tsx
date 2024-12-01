/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useOkto } from 'okto-sdk-react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '@/app/layout';

const LoginButton = () => {
  const router = useRouter();
  const { authenticate } = useOkto();
  const { authToken, setAuthToken, handleLogout } = useContext(AuthContext);

  const handleGoogleLogin = async (credentialResponse: { credential: any; }) => {
    console.log('Google login response:', credentialResponse);
    const idToken = credentialResponse.credential;
    
    authenticate(idToken, async (authResponse: { auth_token: string | null; }, error: any) => {
      if (authResponse) {
        console.log('Authentication successful:', authResponse);
        setAuthToken(authResponse.auth_token);
        router.push('/trade');
      }
      if (error) {
        console.error('Authentication error:', error);
        // You might want to add error handling UI here
      }
    });
  };

  const onLogoutClick = () => {
    handleLogout();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!authToken ? (
        <div className="relative">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => {
              console.log('Login Failed', error);
            }}
            useOneTap
            promptMomentNotification={(notification) =>
              console.log('Prompt moment notification:', notification)
            }
          />
        </div>
      ) : (
        <button
          onClick={onLogoutClick}
          className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default LoginButton;