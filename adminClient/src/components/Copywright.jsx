import React from 'react';

export default function copywright() {
  return (
    <div className="bg-blue-900 text-white text-center py-2 text-sm font-light">
      &copy; {new Date().getFullYear()} Team Rawjet. All rights reserved.
    </div>
  );
}
