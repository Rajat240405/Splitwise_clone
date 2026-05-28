/**
 * Reusable Card Component
 * 
 * @param {string} className - Additional CSS classes
 * @param {boolean} hover - Add hover effect
 * @param {function} onClick - Click handler
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 */
export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md'
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
