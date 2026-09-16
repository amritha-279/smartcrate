import React from 'react';

export default function Button({
  children, variant = 'primary', size = '', onClick,
  disabled = false, type = 'button', fullWidth = false, style = {}
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{ width: fullWidth ? '100%' : undefined, ...style }}
    >
      {children}
    </button>
  );
}
