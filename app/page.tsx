'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // LocalStorageからユーザーIDを取得、なければ生成
    let userId = localStorage.getItem('habitTrackerUserId');

    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('habitTrackerUserId', userId);
    }

    // ユーザーページにリダイレクト
    router.push(`/${userId}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          業務習慣化アプリを読み込み中...
        </h2>
      </div>
    </div>
  );
}
