
import React from 'react';

interface CommandDeckProps {
  onClose: () => void;
}

const CommandDeck: React.FC<CommandDeckProps> = ({ onClose }) => {
  return (
    <div>
      <nav>
        <ul>
          <li>Blog</li>
          <li>Pricing</li>
          <li>About Us</li>
          <li>Login</li>
        </ul>
      </nav>
      <button aria-label="Close navigation menu" onClick={onClose}>Close</button>
    </div>
  );
};

export default CommandDeck;
