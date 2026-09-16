import React from 'react';

export default function InputField({
  label, name, type = 'text', value, onChange,
  placeholder = '', error = '', required = false,
  options = [], min, max, step
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--risk-high)' }}>*</span>}
        </label>
      )}
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`form-input${error ? ' error' : ''}`}
          value={value}
          onChange={onChange}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`form-input${error ? ' error' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
