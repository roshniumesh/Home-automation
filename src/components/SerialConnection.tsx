import React from 'react';
import { Wifi, WifiOff, Zap, AlertCircle } from 'lucide-react';

interface SerialConnectionProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  error: string | null;
  lastMessage?: string;
}

const SerialConnection: React.FC<SerialConnectionProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
  error,
  lastMessage
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Arduino Connection</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-gray-400" />
          )}
          <span className={`text-sm font-medium ${
            isConnected ? 'text-green-600' : 'text-gray-500'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        {!isConnected ? (
          <button
            onClick={onConnect}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Connect Arduino
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Disconnect
          </button>
        )}
      </div>

      {lastMessage && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Last message:</p>
          <p className="text-sm text-gray-800 font-mono">{lastMessage}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Setup Instructions:</strong></p>
        <ol className="mt-1 space-y-1 list-decimal list-inside">
          <li>Connect Arduino via USB</li>
          <li>Upload gesture recognition sketch</li>
          <li>Click "Connect Arduino" button</li>
          <li>Select correct COM port</li>
          <li>Start controlling devices with gestures!</li>
        </ol>
      </div>
    </div>
  );
};

export default SerialConnection;