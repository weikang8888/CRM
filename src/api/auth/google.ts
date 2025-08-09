// Initiate Google OAuth login by redirecting to backend
export const initiateGoogleLogin = () => {
  const backendURL = import.meta.env.VITE_API_BASE_URL;
  window.location.href = `${backendURL}/google`;
};

// Handle Google OAuth callback parameters
export const handleGoogleCallback = (searchParams: URLSearchParams) => {
  const token = searchParams.get('token');
  const role = searchParams.get('role');
  const _id = searchParams.get('_id');
  const error = searchParams.get('error');

  if (error) {
    throw new Error(error);
  }

  if (token && role && _id) {
    return {
      token,
      role,
      _id,
    };
  }

  throw new Error('Missing authentication parameters');
};
