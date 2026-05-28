/**
 * Alert Component
 * 
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Alert message
 * @param {function} onClose - Close handler (optional)
 */
export default function Alert({
  type = 'info',
  message,
  onClose
}) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✓'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '✕'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ'
    }
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-3 flex items-start gap-2`}>
      <span className="flex-shrink-0">{style.icon}</span>
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
}
