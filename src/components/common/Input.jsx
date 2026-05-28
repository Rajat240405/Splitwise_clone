/**
 * Reusable Input Component
 * 
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} type - Input type
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether field is required
 */
export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  required = false,
  id,
  name,
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name || inputId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 
          border rounded-lg 
          text-gray-900 placeholder-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
