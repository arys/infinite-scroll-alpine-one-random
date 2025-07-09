'use client';

import { useState } from 'react';

interface DisclaimerScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function DisclaimerScreen({ onAccept, onDecline }: DisclaimerScreenProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen overflow-y-auto">
      <div className="px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-thin tracking-wider">
            I think I know you.
            </h1>
            <p className="text-lg text-gray-400 tracking-wide">
            A Media Art Installation
            </p>
          </div>

          {/* Content Warning */}
          <div className="bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium text-red-300">⚠️ Important Notice</h2>
            <div className="text-sm space-y-3 text-gray-300">
              <p>
                This is an <strong>experimental media art installation</strong> that explores 
                how social media algorithms manipulate emotions through personalized content.
              </p>
              <p>
                The experience may trigger <strong>strong emotional responses</strong> as it 
                analyzes your interactions and progressively shows more intense, personal content.
              </p>
              <p>
                <strong>This is not real social media.</strong> All content is pre-written. 
                No personal data is collected or stored. Everything resets when you close the page.
              </p>
            </div>
          </div>

          {/* Safety Information */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium text-blue-300">🛡️ Your Safety</h2>
            <div className="text-sm space-y-3 text-gray-300">
              <p>
                <strong>You are in complete control.</strong> You can exit at any time by:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Pressing the <kbd className="bg-gray-700 px-2 py-1 rounded">ESC</kbd> key</li>
                <li>Clicking the ✕ button in the top right</li>
                <li>Closing your browser tab</li>
              </ul>
              <p>
                If this experience causes distress, please seek support from:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                <li><strong>Mental Health Services:</strong> Contact your local provider</li>
              </ul>
            </div>
          </div>

          {/* Artistic Intent */}
          <div className="bg-gray-900 bg-opacity-50 border border-gray-600 border-opacity-30 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium text-gray-300">🎨 Artistic Intent</h2>
            <div className="text-sm space-y-3 text-gray-400">
              <p>
                This installation critiques how recommendation algorithms create echo chambers 
                of emotional content, potentially leading users into deeper psychological states.
              </p>
              <p>
                By experiencing this artificial system, we hope to raise awareness about 
                how real platforms may affect your mental health and emotional well-being.
              </p>
              <p>
                <em>Created as commentary on algorithmic manipulation in social media.</em>
              </p>
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-300">
                I understand this is an art installation exploring algorithmic manipulation. 
                I acknowledge the warnings above and consent to participate in this experimental experience.
              </span>
            </label>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={onDecline}
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Exit
              </button>
              <button
                onClick={onAccept}
                disabled={!isChecked}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isChecked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Enter Installation
              </button>
            </div>
          </div>

          {/* Technical Notice */}
          <div className="text-center text-xs text-gray-500 space-y-2">
            <p>
              This installation works best with audio enabled and in fullscreen mode.
            </p>
            <p>
              Compatible with modern browsers. No data is transmitted or stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 