import React from 'react';
import { ReadReceiptStatus } from '../types/chat';

interface ReadReceiptIconProps {
  status?: ReadReceiptStatus;
  className?: string;
  isStarred?: boolean;
}

export const ReadReceiptIcon: React.FC<ReadReceiptIconProps> = ({
  status = 'read',
  className = '',
  isStarred = false,
}) => {
  if (status === 'none') return null;

  return (
    <span className={`inline-flex items-center gap-0.5 select-none ${className}`}>
      {isStarred && (
        <svg className="w-2.5 h-2.5 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}

      {status === 'pending' && (
        <svg className="w-3 h-3 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
        </svg>
      )}

      {status === 'sent' && (
        /* Single gray check */
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 16 15" fill="currentColor">
          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.466 12.35 2.477 7.915a.365.365 0 0 0-.52-.022l-.43.398a.365.365 0 0 0-.022.52l4.475 4.974c.14.156.378.163.526.015l8.441-10.4a.365.365 0 0 0 .063-.084z" />
        </svg>
      )}

      {status === 'delivered' && (
        /* Double gray checks */
        <svg className="w-4 h-3.5 text-slate-400" viewBox="0 0 18 15" fill="currentColor">
          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.466 12.35 2.477 7.915a.365.365 0 0 0-.52-.022l-.43.398a.365.365 0 0 0-.022.52l4.475 4.974c.14.156.378.163.526.015l8.441-10.4a.365.365 0 0 0 .063-.084z" />
          <path d="M17.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.466 12.35l-1.5-1.666a.365.365 0 0 0-.52-.022l-.43.398a.365.365 0 0 0-.022.52l1.975 2.194c.14.156.378.163.526.015l8.441-10.4a.365.365 0 0 0 .074-.063z" opacity="0.9" />
        </svg>
      )}

      {status === 'read' && (
        /* Double blue checks (WhatsApp distinctive #53bdeb or #4fc3f7 blue) */
        <svg className="w-4 h-3.5 text-[#53bdeb]" viewBox="0 0 18 15" fill="currentColor">
          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.466 12.35 2.477 7.915a.365.365 0 0 0-.52-.022l-.43.398a.365.365 0 0 0-.022.52l4.475 4.974c.14.156.378.163.526.015l8.441-10.4a.365.365 0 0 0 .063-.084z" />
          <path d="M17.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.466 12.35l-1.5-1.666a.365.365 0 0 0-.52-.022l-.43.398a.365.365 0 0 0-.022.52l1.975 2.194c.14.156.378.163.526.015l8.441-10.4a.365.365 0 0 0 .074-.063z" />
        </svg>
      )}
    </span>
  );
};
