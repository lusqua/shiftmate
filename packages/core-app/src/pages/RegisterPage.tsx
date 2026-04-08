import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

type Props = {
  onRegister: (
    name: string,
    email: string,
    password: string,
    restaurantName: string,
  ) => Promise<any>;
  loading: boolean;
};

export const RegisterPage = ({ onRegister, loading }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await onRegister(name, email, password, restaurantName);
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
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
          Create your account and restaurant
        </p>

        {error && (
          <div className="rounded-lg bg-error/10 text-error text-xs p-3 mb-4">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="text-xs text-base-content/50 mb-1 block">
            Your Name
          </label>
          <input
            type="text"
            className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-3">
          <label className="text-xs text-base-content/50 mb-1 block">
            Password
          </label>
          <input
            type="password"
            className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="mb-5">
          <label className="text-xs text-base-content/50 mb-1 block">
            Restaurant Name
          </label>
          <input
            type="text"
            className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
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
            "Create Account"
          )}
        </button>

        <p className="text-center text-xs text-base-content/40 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
