import React from 'react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-white text-blue-900 font-sans px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">E-Election</h1>
        <p className="text-lg md:text-xl text-blue-800 mb-6">
          Choose your representative digitally and securely.
        </p>
      </div>
    </main>
  );
}
