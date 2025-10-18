import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ZipIcon, ShareIcon, AlertTriangleIcon } from './ui/Icons';

// This is a global variable from the script tag in index.html
declare const JSZip: any;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName: string;
}

// Helper to convert a data URL to a File object for the Web Share API
async function dataURLToFile(dataURL: string, fileName: string): Promise<File | null> {
    try {
        const res = await fetch(dataURL);
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        console.error("Error converting data URL to File:", error);
        return null;
    }
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, imageUrl, fileName }) => {
  const [canShare, setCanShare] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if the Web Share API is available
  useEffect(() => {
    if (navigator.share) {
        // If canShare exists, use it to check for file sharing capability
        if (typeof navigator.canShare === 'function') {
            const dummyFile = new File([""], "test.png", { type: "image/png" });
            if (navigator.canShare({ files: [dummyFile] })) {
                setCanShare(true);
            }
        // Fallback for browsers that have .share but not .canShare
        } else {
             setCanShare(true);
        }
    }
  }, []);

  const handleDownloadZip = useCallback(async () => {
    // Defensive check to ensure the JSZip library has loaded
    if (typeof JSZip === 'undefined') {
        alert("Error: The zipping library hasn't loaded yet. Please check your internet connection and try again.");
        console.error("JSZip is not defined. The script may have failed to load.");
        return;
    }

    setIsProcessing(true);
    try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();

        const zip = new JSZip();
        // OPTIMIZATION: Use 'STORE' compression for PNGs, as they are already compressed.
        // This is much faster than the default 'DEFLATE'.
        zip.file(fileName, blob, { compression: 'STORE' });

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = fileName.replace(/\.png$/, '.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Failed to create zip file", error);
        alert("Sorry, there was an error creating the zip file.");
    } finally {
        setIsProcessing(false);
        // We close the modal after the action is initiated.
        onClose();
    }
  }, [imageUrl, fileName, onClose]);

  const handleWebShare = useCallback(async () => {
    setIsProcessing(true);
    try {
        const fileToShare = await dataURLToFile(imageUrl, fileName);
        if (fileToShare) {
            await navigator.share({
                files: [fileToShare],
                title: 'Secure Image',
                text: 'Here is an image containing a securely encrypted file.'
            });
        } else {
             throw new Error("Could not create file for sharing.");
        }
    } catch (error) {
        console.error("Web Share API error:", error);
        // User cancellation is not an error, so we don't show an alert for it.
        if ((error as Error).name !== 'AbortError') {
             alert("Sorry, the file could not be shared.");
        }
    } finally {
        setIsProcessing(false);
        // We close the modal after the action is initiated.
        onClose();
    }
  }, [imageUrl, fileName, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Secure Image">
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20">
          <h3 className="font-bold text-emerald-700 dark:text-emerald-200">Recommended: Download as .zip</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-4">
            This is the safest way to share. It protects your image from being damaged by social media and messaging apps.
          </p>
          <Button onClick={handleDownloadZip} className="w-full" disabled={isProcessing}>
            <ZipIcon className="w-5 h-5 mr-2" />
            {isProcessing ? 'Zipping...' : 'Download .zip File'}
          </Button>
        </div>

        {canShare && (
          <div>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white/80 dark:bg-slate-900/80 px-2 text-sm text-slate-500">OR</span>
                </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 text-center">
              Use your device's share menu. <br/>
              (Choose an app like Email or a file manager.)
            </p>
            <Button onClick={handleWebShare} variant="secondary" className="w-full" disabled={isProcessing}>
              <ShareIcon className="w-5 h-5 mr-2" />
              {isProcessing ? 'Preparing...' : 'Share via...'}
            </Button>
          </div>
        )}

        <div className="p-4 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/20 flex items-start gap-3">
            <AlertTriangleIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Important Security Reminder</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Always send the password in a separate, secure message. Never include it with the image file.
                </p>
            </div>
        </div>
      </div>
    </Modal>
  );
};