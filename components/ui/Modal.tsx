import React, { useEffect, useRef } from 'react';
import { XIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Store the element that had focus before the modal opened
      triggerRef.current = document.activeElement;

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
      
      // Focus the modal or the first focusable element inside it
      setTimeout(() => modalRef.current?.focus(), 0);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleEsc);
        // Return focus to the original element when the modal closes
        (triggerRef.current as HTMLElement)?.focus();
      };
    }
  }, [isOpen, onClose]);

  // Focus trapping logic
  useEffect(() => {
    const handleFocusTrap = (event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    };

    if (isOpen) {
        window.addEventListener('keydown', handleFocusTrap);
        return () => {
            window.removeEventListener('keydown', handleFocusTrap);
        };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-black/10 dark:border-white/10 flex flex-col max-h-[calc(100vh-2rem)]"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1} // Make the modal container focusable
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-500 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        /* Add a focus outline for accessibility */
        .dark [tabindex="-1"]:focus {
          outline: 2px solid #0ea5e9;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};