import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "../lib/firebase";
import { createSession } from "../lib/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        await createSession(idToken);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        await createSession(idToken);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary-container selection:text-on-primary-container">
      {/* Left side: branding/editorial */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low flex-col justify-between p-12 relative overflow-hidden border-r border-outline-variant/10">
        <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPlTqcgzVP0piVJIwYf9zjS_Ic_vxamat3D_sDdIR-4qV3T3yJy6ZuCBlgONITy8sy5pukcA9LrjJ6T_pPzcsbShlhP5SoozvP5zeZ08j5x2s9ZXTNLEpAoaoyWPgqvtE-j95N0dlUtfTFnFMRNF7v7AorJlnQj9PuZyE1ksahsODutwstYZ7HeElWPnyVyutIfd_S_O5jBl4OOkNoIgTKd10haeN9eUAuJM7MbqmwnCTOY6TnFPk4rLrG75QNIgHVRVmpRQaZNNgy')] opacity-[0.03] mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10">
          <Link to="/" className="font-display text-2xl font-bold text-primary">
            ExamForge
          </Link>
          <p className="mt-4 font-notes text-lg text-on-surface-variant max-w-md italic">
            Curating academic excellence through precision and focus.
          </p>
        </div>
        <div className="relative z-10 mb-12">
          <blockquote className="font-notes text-3xl text-on-surface leading-tight mb-4">
            "Focus is the art of knowing what to ignore."
          </blockquote>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              to="/"
              className="font-display text-3xl font-bold text-primary block text-center"
            >
              ExamForge
            </Link>
          </div>
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold text-on-surface mb-2">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant">
              Sign in to continue your curriculum.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm border border-error/20">
                {error}
              </div>
            )}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-6 text-lg tracking-wide rounded-2xl"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-on-surface-variant">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={handleGoogleLogin}
              className="w-full py-6 rounded-2xl border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5 mr-3"
                alt="Google"
              />
              Sign in with Google
            </Button>
          </div>

          <p className="mt-10 text-center text-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-primary hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
