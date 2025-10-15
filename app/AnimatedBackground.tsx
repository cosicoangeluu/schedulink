'use client';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-6000"></div>
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-8000"></div>
      <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-10000"></div>
    </div>
  );
}
