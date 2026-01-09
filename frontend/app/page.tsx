'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { removeToken } from '../utils/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('role');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight">
          Welcome <span className={user.role === 'admin' ? "text-red-500" : "text-blue-500"}>
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </h1>

        <p className="text-xl text-gray-400">
          You are logged in as <span className="font-mono text-white">{user.email}</span>
        </p>

        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-lg font-semibold transition ring-1 ring-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
