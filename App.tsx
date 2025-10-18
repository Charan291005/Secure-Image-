import React, { useState } from 'react';
import { EncryptView } from './components/EncryptView';
import { DecryptView } from './components/DecryptView';
import { Toggle } from './components/ui/Toggle';
import { LockIcon, UnlockIcon, KeyIcon, ImageIcon, ShieldCheckIcon } from './components/ui/Icons';
import { Card } from './components/ui/Card';

type Mode = 'encrypt' | 'decrypt';

const HowItWorks: React.FC = () => (
    <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            Our tool uses a combination of strong AES-256 encryption and LSB steganography to securely hide your files inside standard PNG images.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                    <KeyIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Encrypt</h3>
                <p className="text-slate-400">Your file and its name are encrypted with your password using AES-256, one of the most secure encryption standards.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Embed</h3>
                <p className="text-slate-400">The encrypted data is embedded into the pixels of your cover image using a technique that is invisible to the naked eye.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShieldCheckIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Secure</h3>
                <p className="text-slate-400">The result is a normal-looking image file that can be shared anywhere, with your secret data hidden securely inside.</p>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encrypt');

  return (
    <div className="min-h-screen w-full gradient-bg-animated text-slate-200 transition-colors duration-500">
      <div className="relative container mx-auto px-4 py-8 sm:py-12 md:py-20">
        <header className="flex justify-between items-start mb-12">
          <div className="text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold gradient-text tracking-tight">
              SecureImage
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Hide your files in plain sight.
            </p>
          </div>
        </header>

        <main className="space-y-12 sm:space-y-16 md:space-y-20">
          <Card className="max-w-3xl mx-auto">
            <div className="p-4 md:p-6">
              <Toggle
                label="Mode"
                option1={{ value: 'encrypt', label: 'Encrypt', icon: <LockIcon className="w-5 h-5" /> }}
                option2={{ value: 'decrypt', label: 'Decrypt', icon: <UnlockIcon className="w-5 h-5" /> }}
                value={mode}
                onChange={(value) => setMode(value as Mode)}
              />
            </div>
            <div className="p-4 sm:p-6 md:p-8 border-t border-white/10">
              {mode === 'encrypt' ? <EncryptView /> : <DecryptView />}
            </div>
          </Card>
          
          <HowItWorks />
        </main>
        
        <footer className="text-center mt-16 sm:mt-20">
            <p className="text-sm text-slate-400/70">
                All encryption and steganography operations are performed locally in your browser.
                <br />
                Your data never leaves your machine.
            </p>
            <p className="text-sm text-slate-500/80 mt-4">
                Made by Shree Charan N
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;