import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-4 px-6">
      <nav className="flex space-x-6 text-sm justify-center">
          <a href="/" className="hover:underline">Home</a>
          <a href="/admin" className="hover:underline">Admin</a>
          <a href="/leader" className="hover:underline">Leader</a>
        </nav>
    </footer>
  );
}
