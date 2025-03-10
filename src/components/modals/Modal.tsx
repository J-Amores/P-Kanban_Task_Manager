'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Close modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Close modal when pressing Escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-dark-gray rounded-md p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="flex-shrink-0"
            type="button"
          >
            <Image 
              src="/assets/icon-cross.svg" 
              alt="Close" 
              width={15} 
              height={15} 
            />
          </button>
        </div>
        
        <div className="transform-gpu">
          {children}
        </div>
      </div>
    </div>
  );
} 