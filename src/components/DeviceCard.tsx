import React from 'react';
import { Device } from '../types';
import { 
  Lightbulb, 
  Thermometer, 
  Shield, 
  DoorOpen, 
  Wind, 
  Zap,
  Eye,
  EyeOff,
  Power,
  PowerOff
} from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onToggle: (deviceId: string) => void;
  onValueChange: (deviceId: string, value: number) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle, onValueChange }) => {
  const getDeviceIcon = () => {
    switch (device.type) {
      case 'light':
        return <Lightbulb className="w-8 h-8" />;
      case 'thermostat':
        return <Thermometer className="w-8 h-8" />;
      case 'security':
        return <Shield className="w-8 h-8" />;
      case 'door':
        return <DoorOpen className="w-8 h-8" />;
      case 'fan':
        return <Wind className="w-8 h-8" />;
      case 'outlet':
        return <Zap className="w-8 h-8" />;
      default:
        return <Power className="w-8 h-8" />;
    }
  };

  const getStatusColor = () => {
    switch (device.status) {
      case 'on':
        return 'text-green-500';
      case 'off':
        return 'text-gray-400';
      case 'locked':
        return 'text-red-500';
      case 'unlocked':
        return 'text-green-500';
      case 'open':
        return 'text-yellow-500';
      case 'closed':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    return device.status.charAt(0).toUpperCase() + device.status.slice(1);
  };

  const isActive = device.status === 'on' || device.status === 'unlocked' || device.status === 'open';

  return (
    <div className={`
      bg-white rounded-xl shadow-md p-6 transition-all duration-300 border-2
      ${isActive ? 'border-blue-200 shadow-lg' : 'border-gray-100'}
      hover:shadow-lg hover:scale-105 cursor-pointer
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className={`
          p-3 rounded-lg transition-colors duration-300
          ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
        `}>
          {getDeviceIcon()}
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} bg-current`} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{device.name}</h3>
        <p className="text-sm text-gray-500">{device.room}</p>
      </div>

      {device.type === 'light' && device.brightness !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Brightness</span>
            <span className="text-sm font-medium text-gray-800">{device.brightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={device.brightness}
            onChange={(e) => onValueChange(device.id, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      {device.type === 'thermostat' && device.temperature !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Temperature</span>
            <span className="text-sm font-medium text-gray-800">{device.temperature}°F</span>
          </div>
          <input
            type="range"
            min="60"
            max="85"
            value={device.temperature}
            onChange={(e) => onValueChange(device.id, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      <button
        onClick={() => onToggle(device.id)}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
          ${isActive 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {isActive ? 'Turn Off' : 'Turn On'}
      </button>

      <div className="mt-3 text-xs text-gray-400 text-center">
        Last updated: {device.lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default DeviceCard;