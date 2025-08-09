import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import { register, RegisterPayload } from 'api/auth/register';
import { initiateGoogleLogin, handleGoogleCallback } from 'api/auth/google';
import { toast } from 'react-toastify';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState<RegisterPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle Google OAuth callback
  useEffect(() => {
    try {
      const authData = handleGoogleCallback(searchParams);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('role', authData.role);
      localStorage.setItem('_id', authData._id);
      toast.success('Google registration successful!');
      navigate('/dashboard');
    } catch (error) {
      // No callback parameters, normal register page
      if (searchParams.has('token') || searchParams.has('error')) {
        const errorMessage = (error as Error).message;
        toast.error(`Google registration failed: ${errorMessage}`);
      }
    }
  }, [searchParams, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(user);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ?? 'Register failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Register
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Let's Join us! create account with,
      </Typography>

      <Stack mt={3} spacing={1.75} width={1}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          disabled={loading}
          onClick={initiateGoogleLogin}
          startIcon={<IconifyIcon icon="logos:google-icon" />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Google(Member)
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          disabled={loading}
          startIcon={<IconifyIcon icon="logos:apple" sx={{ mb: 0.5 }} />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Apple
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }}>or Register with</Divider>

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        <TextField
          id="firstName"
          name="firstName"
          type="text"
          value={user.firstName}
          onChange={handleInputChange}
          variant="filled"
          placeholder="First Name"
          autoComplete="given-name"
          fullWidth
          autoFocus
          required
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:user-circle-02" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="lastName"
          name="lastName"
          type="text"
          value={user.lastName}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Last Name"
          autoComplete="family-name"
          fullWidth
          required
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:user-circle-02" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Email"
          autoComplete="email"
          fullWidth
          required
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:mail-at-sign-02" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Password"
          autoComplete="current-password"
          fullWidth
          required
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:lock-key" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: user.password ? 1 : 0,
                  pointerEvents: user.password ? 'auto' : 'none',
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  sx={{ border: 'none', bgcolor: 'transparent !important' }}
                  edge="end"
                >
                  <IconifyIcon
                    icon={showPassword ? 'fluent-mdl2:view' : 'fluent-mdl2:hide-3'}
                    color="neutral.light"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="filled" fullWidth required>
          <Select
            id="role"
            name="role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            disabled={loading}
            startAdornment={
              <InputAdornment position="start" sx={{ pl: 1.5 }}>
                <IconifyIcon icon="hugeicons:user-circle-02" />
              </InputAdornment>
            }
            displayEmpty
            inputProps={{ 'aria-label': 'Role' }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Mentor">Mentor</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
          </Select>
        </FormControl>

        <Button 
          type="submit" 
          variant="contained" 
          size="medium" 
          fullWidth 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 1.5 }}
        >
          Sign Up
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
    </>
  );
};

export default Register;
