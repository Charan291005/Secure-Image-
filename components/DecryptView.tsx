import React, { useState, useCallback } from 'react';
import { FileDropzone } from './ui/FileDropzone';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import { decryptFile } from '../services/cryptoService';
import { extractDataFromImage } from '../services/steganographyService';
import { CheckCircleIcon, AlertTriangleIcon, DownloadIcon, FileIcon, EyeIcon, EyeOffIcon } from './ui/Icons';
import { getFileType } from '../utils/fileUtils';

type Status = 'idle' | 'extracting' | 'decrypting' | 'success' | 'error';

interface ProcessState {
  status: Status;
  message: string;
  progress: number;
}

interface DecryptedFile {
  blob: Blob;
  name: string;
  url: string;
}

export const DecryptView: React.FC = () => {
  const [stegoImage, setStegoImage] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [decryptedFile, setDecryptedFile] = useState<DecryptedFile | null>(null);
  const [processState, setProcessState] = useState<ProcessState>({
    status: 'idle',
    message: '',
    progress: 0,
  });

  const resetState = () => {
    setStegoImage(null);
    setPassword('');
    setDecryptedFile(null);
    setProcessState({ status: 'idle', message: '', progress: 0 });
  };
  
  const handleDecrypt = useCallback(async () => {
    if (!stegoImage || !password) {
      setProcessState({ status: 'error', message: 'Image and password are required.', progress: 0 });
      return;
    }

    try {
      setProcessState({ status: 'extracting', message: 'Extracting data from image...', progress: 25 });
      const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(stegoImage);
      });
      
      const extractedData = await extractDataFromImage(imageElement, (p) => {
          setProcessState(prev => ({...prev, progress: 25 + p * 0.5}))
      });

      if (!extractedData) {
        throw new Error('No data found in image.');
      }

      setProcessState({ status: 'decrypting', message: 'Decrypting file...', progress: 75 });
      const { decryptedBuffer, originalFileName } = await decryptFile(extractedData, password);
      
      const fileBlob = new Blob([decryptedBuffer]);
      const fileUrl = URL.createObjectURL(fileBlob);

      setDecryptedFile({ blob: fileBlob, name: originalFileName, url: fileUrl });
      setProcessState({ status: 'success', message: 'Decryption successful! Your file is ready.', progress: 100 });

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      let friendlyMessage = errorMessage;

      if (errorMessage.includes('No data found in image')) {
        friendlyMessage = 'No hidden data found. Please use the original, unmodified PNG. Images modified by other apps (e.g., social media) will not work.';
      } else if (errorMessage.includes('The password may be incorrect or the data corrupted')) {
        friendlyMessage = 'Decryption failed. Please double-check your password.';
      }
      
      setProcessState({ status: 'error', message: friendlyMessage, progress: 0 });
    }
  }, [stegoImage, password]);

  const isProcessing = processState.status === 'extracting' || processState.status === 'decrypting';

  return (
    <div className="space-y-8">
      <FileDropzone
        label="1. Upload Stego Image"
        file={stegoImage}
        onFileChange={setStegoImage}
        accept="image/png"
        disabled={isProcessing}
        helpText="Upload the original, unmodified PNG image."
        showImagePreview={true}
      />
      
      <Input
        id="password-decrypt"
        type={isPasswordVisible ? 'text' : 'password'}
        label="2. Enter Decryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter the password used for encryption"
        disabled={isProcessing}
        endAdornment={
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        }
      />

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

      {processState.status === 'success' && decryptedFile && (
        <div className="p-6 bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/20 rounded-lg text-center">
             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <FileIcon className="w-10 h-10" fileType={getFileType(decryptedFile.name)} />
             </div>
             <p className="text-sky-800 dark:text-sky-200 font-medium text-lg">
                File Recovered!
            </p>
            <div className="mt-2 mb-6 text-center max-w-sm mx-auto bg-black/5 dark:bg-black/20 p-3 rounded-lg">
                <p className="font-semibold text-slate-700 dark:text-slate-100 truncate">{decryptedFile.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{(decryptedFile.blob.size / 1024).toFixed(2)} KB</p>
            </div>
            <div className="grid grid-cols-1 sm:flex sm:justify-center gap-3 sm:gap-4">
                <Button
                onClick={() => {
                    const a = document.createElement('a');
                    a.href = decryptedFile.url;
                    a.download = decryptedFile.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    // No need to revoke, as the component might re-render. Let browser handle it.
                }}
                variant="primary"
                >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download File
                </Button>
                <Button onClick={resetState} variant="secondary">
                Decrypt Another
                </Button>
            </div>
        </div>
      )}

      {processState.status !== 'success' && (
        <Button
          onClick={handleDecrypt}
          disabled={isProcessing || !stegoImage || !password}
          className="w-full text-lg py-3"
        >
          {isProcessing ? 'Processing...' : 'Extract & Decrypt File'}
        </Button>
      )}
    </div>
  );
};
