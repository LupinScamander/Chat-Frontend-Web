'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

            {user ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-2 text-gray-900">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-2 text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'online'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'away'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading profile...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
