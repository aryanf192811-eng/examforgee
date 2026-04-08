import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import { useAuthStore } from '../lib/store/authStore';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
} from '../lib/firebase';
import { syncAuth, getMe } from '../lib/api';
import type { FirebaseUser } from '../lib/firebase';

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Signup() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setUser, setIdToken, setFirebaseUser } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePostAuth(firebaseUser: FirebaseUser) {
    const token = await firebaseUser.getIdToken();
    setFirebaseUser(firebaseUser);
    setIdToken(token);

    try {
      await syncAuth({
        id_token: token,
      });
    } catch {
      // sync might fail — continue
    }

    try {
      const profile = await getMe();
      setUser(profile);
    } catch {
      // continue
    }

    navigate('/dashboard', { replace: true });
  }

  async function handleEmailSignup() {
    if (!name.trim()) {
      addToast('Please enter your name.', 'warning');
      return;
    }
    if (!email || !password) {
      addToast('Please fill in all fields.', 'warning');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handlePostAuth(result.user);
      addToast('Account created successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handlePostAuth(result.user);
      addToast('Account created successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google signup failed';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container-low items-center justify-center">
        <div className="absolute inset-0 gradient-cta opacity-5" />
        <div className="grain-overlay" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-on-primary text-[32px]">
              school
            </span>
          </div>
          <h1 className="font-display text-display-md text-on-surface mb-4">
            Join ExamForge
          </h1>
          <p className="font-headline text-headline-sm text-on-surface-variant">
            Begin your journey to GATE mastery with precision and elegance.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[22px]">
                local_library
              </span>
            </div>
            <span className="font-display text-headline-sm text-on-surface">
              ExamForge
            </span>
          </div>

          <h2 className="font-display text-headline-lg text-on-surface mb-2">
            Create your account
          </h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            Start preparing for GATE CSE today
          </p>

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="mb-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-surface-container-high" />
            <span className="text-label-md text-outline">or</span>
            <div className="flex-1 h-px bg-surface-container-high" />
          </div>

          <div role="form" className="space-y-4 mb-6">
            <Input
              label="Full Name"
              icon="person"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Email"
              type="email"
              icon="mail"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon="lock"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              trailing={
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEmailSignup();
              }}
            />
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleEmailSignup}
            loading={loading}
          >
            Create Account
          </Button>

          <p className="text-center text-body-md text-on-surface-variant mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
