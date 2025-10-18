import React, { useState, useCallback, useEffect } from 'react';
import { FileDropzone } from './ui/FileDropzone';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import { PasswordStrengthMeter } from './ui/PasswordStrengthMeter';
import { usePasswordStrength } from '../hooks/usePasswordStrength';
import { encryptFile } from '../services/cryptoService';
import { embedDataInImage, calculateCapacity } from '../services/steganographyService';
import { CheckCircleIcon, AlertTriangleIcon, DownloadIcon, ShieldCheckIcon, ShareIcon } from './ui/Icons';
import { ShareModal } from './ShareModal';

type Status = 'idle' | 'encrypting' | 'embedding' | 'success' | 'error';

interface ProcessState {
  status: Status;
  message: string;
  progress: number;
}

export const EncryptView: React.FC = () => {
  const [payloadFile, setPayloadFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [stegoImageUrl, setStegoImageUrl] = useState<string | null>(null);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [processState, setProcessState] = useState<ProcessState>({
    status: 'idle',
    message: '',
    progress: 0,
  });
  const [capacityInfo, setCapacityInfo] = useState<{ capacity: number; required: number | null; hasEnough: boolean } | null>(null);

  const passwordStrength = usePasswordStrength(password);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (coverImage) {
      objectUrl = URL.createObjectURL(coverImage);
      const imageElement = new Image();
      imageElement.onload = () => {
        const capacity = calculateCapacity(imageElement);
        let required: number | null = null;
        let hasEnough = true;

        if (payloadFile) {
            // Overhead: 16b salt + 12b IV + 2b filename length + 16b GCM tag + filename
            const overhead = 16 + 12 + 2 + 16 + new TextEncoder().encode(payloadFile.name).length;
            required = payloadFile.size + overhead;
            hasEnough = capacity >= required;
        }

        setCapacityInfo({
            capacity,
            required,
            hasEnough,
        });
      };
      imageElement.src = objectUrl;
    } else {
      setCapacityInfo(null);
    }

    return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
  }, [payloadFile, coverImage]);

  const resetState = () => {
    setPayloadFile(null);
    setCoverImage(null);
    setPassword('');
    setStegoImageUrl(null);
    setProcessState({ status: 'idle', message: '', progress: 0 });
    setCapacityInfo(null);
    setShareModalOpen(false);
  };

  const handleEncrypt = useCallback(async () => {
    if (!payloadFile || !coverImage || !password) {
      setProcessState({ status: 'error', message: 'All fields are required.', progress: 0 });
      return;
    }
    
    if (capacityInfo && !capacityInfo.hasEnough) {
      setProcessState({ status: 'error', message: 'Cover image is too small for the selected payload file.', progress: 0 });
      return;
    }

    try {
      setProcessState({ status: 'encrypting', message: 'Encrypting file...', progress: 25 });
      const encryptedData = await encryptFile(payloadFile, password);

      const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(coverImage);
      });

      const capacity = calculateCapacity(imageElement);
      if (encryptedData.byteLength > capacity) {
          throw new Error(`Cover image too small. Required: ${encryptedData.byteLength} bytes, Available: ${capacity} bytes.`);
      }

      setProcessState({ status: 'embedding', message: 'Embedding data into image...', progress: 50 });
      const newImageUrl = await embedDataInImage(imageElement, encryptedData, (p) => {
        setProcessState(prev => ({ ...prev, progress: 50 + p * 0.5 }));
      });
      
      setStegoImageUrl(newImageUrl);
      setProcessState({ status: 'success', message: 'Encryption and embedding successful!', progress: 100 });

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setProcessState({ status: 'error', message: `Encryption failed: ${errorMessage}`, progress: 0 });
    }
  }, [payloadFile, coverImage, password, capacityInfo]);

  const isProcessing = processState.status === 'encrypting' || processState.status === 'embedding';

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <FileDropzone
          label="1. Select Payload File"
          file={payloadFile}
          onFileChange={setPayloadFile}
          disabled={isProcessing}
        />
        <FileDropzone
          label="2. Select Cover Image"
          file={coverImage}
          onFileChange={setCoverImage}
          accept="image/png,image/jpeg"
          disabled={isProcessing}
          showImagePreview={true}
        />
      </div>

      {capacityInfo && (
        <div className={`p-4 rounded-lg text-sm flex items-start gap-3 border ${capacityInfo.hasEnough ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/20' : 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/20'}`}>
          {capacityInfo.hasEnough ? <CheckCircleIcon className="w-6 h-6 flex-shrink-0" /> : <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" />}
          <div className="space-y-1">
            <p>Cover Image Capacity: <strong>{(capacityInfo.capacity / 1024).toFixed(2)} KB</strong></p>
            {capacityInfo.required !== null ? (
              <p>Required Space: <strong>{(capacityInfo.required / 1024).toFixed(2)} KB</strong> (file + encryption overhead)</p>
            ) : <p>Select a payload file to see required space.</p>}
            
            {!capacityInfo.hasEnough && capacityInfo.required !== null && (
                <p className="font-bold mt-1 text-red-500 dark:text-red-300">Please select a larger cover image or smaller payload file.</p>
            )}
          </div>
        </div>
      )}

      <div>
        <Input
          id="password-encrypt"
          type="password"
          label="3. Set Encryption Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a strong password"
          disabled={isProcessing}
        />
        {password && <PasswordStrengthMeter strength={passwordStrength} />}
      </div>
      
      {processState.status !== 'idle' && processState.status !== 'success' && (
        <div className="space-y-2">
            <ProgressBar progress={processState.progress} />
            <div className="flex items-center text-sm pt-1">
                {processState.status === 'error' && <AlertTriangleIcon className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />}
                <p className={`${processState.status === 'error' ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {processState.message}
                </p>
            </div>
        </div>
      )}

      {processState.status === 'success' && stegoImageUrl && (
        <div className="p-6 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
            <ShieldCheckIcon className="w-10 h-10" />
          </div>
          <p className="text-emerald-700 dark:text-emerald-200 font-medium text-lg">
            Your file is securely hidden.
          </p>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Download the image and use it to decrypt your file later.
            </p>
          <img src={stegoImageUrl} alt="Steganography Result" className="max-w-xs mx-auto rounded-md shadow-lg border border-black/10 dark:border-white/10 mb-6" />
          <div className="grid grid-cols-1 sm:flex sm:justify-center sm:flex-wrap gap-3 sm:gap-4">
            <Button
              onClick={() => {
                const a = document.createElement('a');
                a.href = stegoImageUrl;
                a.download = `stego_${coverImage?.name.replace(/\.[^/.]+$/, "") || 'image'}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              variant="primary"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download Image
            </Button>
            <Button onClick={() => setShareModalOpen(true)} variant="secondary">
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button onClick={resetState} variant="secondary">
              Encrypt Another
            </Button>
          </div>
        </div>
      )}

      {processState.status !== 'success' && (
        <Button
          onClick={handleEncrypt}
          disabled={isProcessing || !payloadFile || !coverImage || !password || (capacityInfo !== null && !capacityInfo.hasEnough)}
          className="w-full text-lg py-3"
        >
          {isProcessing ? 'Processing...' : 'Encrypt & Embed File'}
        </Button>
      )}

      {stegoImageUrl && coverImage && (
        <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setShareModalOpen(false)}
            imageUrl={stegoImageUrl}
            fileName={`stego_${coverImage.name.replace(/\.[^/.]+$/, "") || 'image'}.png`}
        />
      )}
    </div>
  );
};