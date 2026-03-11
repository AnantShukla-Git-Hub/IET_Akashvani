'use client';

import Link from 'next/link';

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-4">
        <h1 className="text-2xl font-bold text-orange-500">🏆 Achievements</h1>
        <p className="text-sm text-gray-400 mt-1">Celebrate student success</p>
      </div>

      {/* Coming Soon Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-gray-400 mb-6">
            Achievements section is under development. Soon you'll be able to share and celebrate your hackathon wins, competition victories, and academic excellence!
          </p>
          
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-orange-500">Planned Features:</h3>
            <ul className="text-left text-sm text-gray-300 space-y-2">
              <li>✅ Submit achievements with proof</li>
              <li>✅ Admin approval system</li>
              <li>✅ Celebration posts in feed</li>
              <li>✅ Achievement leaderboard</li>
              <li>✅ Category-wise filtering</li>
              <li>✅ Share on social media</li>
            </ul>
          </div>

          <Link
            href="/feed"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            ← Back to Feed
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] px-4 py-3">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          <Link href="/feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Feed</span>
          </Link>
          <Link href="/rooms" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-xs">Rooms</span>
          </Link>
          <Link href="/achievements" className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Achievements</span>
          </Link>
          <Link href="/announcements" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">📢</span>
            <span className="text-xs">Announcements</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
