import React from 'react';

export const Button: React.FC<{ onClick?: React.MouseEventHandler<HTMLButtonElement>; children: React.ReactNode }> = ({
  onClick,
  children,
}) => {
  return <button onClick={onClick}>{children}</button>;
};
