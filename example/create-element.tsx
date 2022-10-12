import React from 'react';

export const EmailInput: React.FC = () => {
  return (
    <label>
      <span>E-mail:</span>
      <input type="email" name="user.email" className="input" />
    </label>
  );
};
