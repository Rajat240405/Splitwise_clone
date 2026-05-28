import { getInitials } from '../../utils/formatCurrency';

/**
 * Avatar Component
 * 
 * @param {string} name - User's name (for initials)
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} color - Background color class
 */

const colors = [
  'bg-teal-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-green-500',
  'bg-indigo-500',
  'bg-red-500'
];

// Generate consistent color based on name
function getColorFromName(name) {
  if (!name) return colors[0];
  const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
}

export default function Avatar({
  name,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const bgColor = getColorFromName(name);
  const initials = getInitials(name);

  return (
    <div
      className={`
        ${sizes[size]}
        ${bgColor}
        rounded-full flex items-center justify-center
        text-white font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
