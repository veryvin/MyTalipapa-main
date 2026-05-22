import React from 'react';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container" id="toasts">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`toast ${t.type}`}
          style={{
            animation: 'slideIn 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => removeToast(t.id)}
        >
          <span>
            {t.type === 'success' && '✅'}
            {t.type === 'error' && '❌'}
            {t.type === 'warning' && '⚠️'}
          </span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
