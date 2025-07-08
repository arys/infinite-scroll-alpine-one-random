'use client';

import { useState, useEffect, useCallback } from 'react';
import DisclaimerScreen from '../components/DisclaimerScreen';
import PhraseFeed from '../components/PhraseFeed';
import { useAmbientAudio } from '../hooks/useAmbientAudio';

type AppState = 'disclaimer' | 'installation' | 'exit';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('disclaimer');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  
  const {
    isPlaying: audioIsPlaying,
    startAudio,
    stopAudio
  } = useAmbientAudio();

  // Handle entering the installation
  const handleEnterInstallation = useCallback(async () => {
    setAppState('installation');
    
    // Start ambient audio
    try {
      await startAudio();
    } catch (error) {
      console.warn('Could not start audio:', error);
    }
  }, [startAudio]);

  // Handle exit requests
  const handleExitRequest = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  // Confirm exit
  const confirmExit = useCallback(() => {
    stopAudio();
    setAppState('exit');
  }, [stopAudio]);

  // Cancel exit
  const cancelExit = useCallback(() => {
    setShowExitConfirmation(false);
  }, []);

  // Handle declining to enter
  const handleDecline = useCallback(() => {
    setAppState('exit');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Prevent accidental navigation away
  useEffect(() => {
    if (appState === 'installation') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [appState]);

  // Exit screen
  if (appState === 'exit') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-lg">
          <h1 className="text-4xl font-thin tracking-wider">
            Thank You
          </h1>
          <div className="text-gray-400 space-y-4">
            <p>
              You have exited the DEEP installation.
            </p>
            <p>
              We hope this experience has provided insight into how 
              algorithmic systems can influence our emotional states.
            </p>
            <p className="text-sm">
              Remember: You always have control over your digital experiences.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Beginning
          </button>
        </div>
      </div>
    );
  }

  // Disclaimer screen
  if (appState === 'disclaimer') {
    return (
      <DisclaimerScreen
        onAccept={handleEnterInstallation}
        onDecline={handleDecline}
      />
    );
  }

  // Main installation
  return (
    <div className="relative">
      {/* Exit confirmation modal */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-medium text-white">Exit Installation?</h2>
            <p className="text-gray-300">
              Are you sure you want to leave? Your session and all algorithm learning will be reset.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={cancelExit}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Experience
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio status indicator */}
      {appState === 'installation' && (
        <div className="fixed top-4 left-4 z-40">
          <div className={`w-3 h-3 rounded-full ${audioIsPlaying ? 'bg-green-500' : 'bg-gray-500'}`}>
            {audioIsPlaying && (
              <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
            )}
          </div>
        </div>
      )}

      {/* Main phrase feed */}
      <PhraseFeed onExit={handleExitRequest} />
    </div>
  );
}
