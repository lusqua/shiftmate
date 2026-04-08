import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

type Props = {
  onLogin: (email: string, password: string) => Promise<any>;
  loading: boolean;
};

export const LoginPage = ({ onLogin, loading }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200/50">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-base-100 shadow-sm border border-base-300/40 p-8 w-96"
      >
        <h1 className="text-xl font-semibold mb-0.5">ShiftMate</h1>
        <p className="text-xs text-base-content/40 mb-6">
          Sign in to manage your schedule
        </p>

        {error && (
          <div className="rounded-lg bg-error/10 text-error text-xs p-3 mb-4">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="text-xs text-base-content/50 mb-1 block">
            Email
          </label>
          <input
            type="email"
            className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-5">
          <label className="text-xs text-base-content/50 mb-1 block">
            Password
          </label>
          <input
            type="password"
            className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-sm w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-xs text-base-content/40 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};
