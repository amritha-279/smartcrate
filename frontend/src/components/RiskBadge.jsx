import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

export default function RiskBadge({ risk }) {
  const map = {
    Low: { cls: 'badge-low', icon: <FaCheckCircle /> },
    Medium: { cls: 'badge-medium', icon: <FaExclamationTriangle /> },
    High: { cls: 'badge-high', icon: <FaTimesCircle /> },
  };
  const { cls, icon } = map[risk] || map['Low'];
  return (
    <span className={`badge ${cls}`}>
      {icon} {risk}
    </span>
  );
}
