import React from 'react';
import { X, Share, MoreVertical, Smartphone } from 'lucide-react';
import { Language, TRANSLATIONS } from '../types';

interface InstallGuideProps {
  language: Language;
  onClose: () => void;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ language, onClose }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-n-dark-card rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-n-cream dark:border-n-dark relative animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-n-cream dark:hover:bg-n-dark-base text-n-olive dark:text-n-sage transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-n-orange/10 rounded-full flex items-center justify-center">
              <Smartphone size={32} className="text-n-orange" />
            </div>
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-n-dark dark:text-n-cream text-center mb-6">
            {t.howToInstall}
          </h2>

          <div className="space-y-6">
            {/* iOS */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 bg-n-base dark:bg-n-dark-base rounded-xl flex items-center justify-center">
                <Share size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-n-dark dark:text-n-cream mb-1">iOS (Safari)</h3>
                <p className="text-sm text-n-olive dark:text-n-sage leading-relaxed">
                  {t.iosInstructions}
                </p>
              </div>
            </div>

            {/* Android */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 bg-n-base dark:bg-n-dark-base rounded-xl flex items-center justify-center">
                <MoreVertical size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-n-dark dark:text-n-cream mb-1">Android (Chrome)</h3>
                <p className="text-sm text-n-olive dark:text-n-sage leading-relaxed">
                  {t.androidInstructions}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 py-3 bg-n-dark dark:bg-n-sage text-white font-bold rounded-xl hover:bg-n-olive transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};