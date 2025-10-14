import React from 'react';

const Navigation = ({ onRouteChange, onSignOut }) => {
  const handleClick = () => {
    if (typeof onSignOut === 'function') {
      onSignOut();  // clears localStorage + resets state
    } else {
      onRouteChange('signin');  // fallback 
    }
  };

  return (
    <nav className="flex justify-end">
      <button
        className="underline hover:cursor-pointer hover:text-blue-500"
        onClick={handleClick}
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navigation;
