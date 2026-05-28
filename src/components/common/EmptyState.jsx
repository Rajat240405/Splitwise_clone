/**
 * Empty State Component
 * 
 * @param {string} icon - Emoji or icon to display
 * @param {string} title - Main message
 * @param {string} description - Secondary message
 * @param {ReactNode} action - Action button/link
 */
export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  description = '',
  action = null
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
