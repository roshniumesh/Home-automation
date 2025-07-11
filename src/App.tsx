import React, { useState, useEffect } from 'react';
import { Device, GestureCommand } from './types';
import { useWebSerial } from './hooks/useWebSerial';
import { useGestureRecognition } from './hooks/useGestureRecognition';
import DeviceCard from './components/DeviceCard';
import GestureArea from './components/GestureArea';
import SerialConnection from './components/SerialConnection';
import RoomSelector from './components/RoomSelector';
import { mockDevices, mockGestureCommands, getRoomDevices, getAllRooms } from './data/mockData';
import { Home, Smartphone, Zap, Settings } from 'lucide-react';

function App() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedRoom, setSelectedRoom] = useState<string>('Living Room');
  const [gestureCommands] = useState<GestureCommand[]>(mockGestureCommands);
  const [activeTab, setActiveTab] = useState<'devices' | 'gestures' | 'settings'>('devices');

  const { isConnected, connect, disconnect, sendCommand, messages, error } = useWebSerial();
  const {
    isRecording,
    gesturePoints,
    recognizedGesture,
    confidence,
    startRecording,
    stopRecording,
    addPoint,
    clearGesture
  } = useGestureRecognition();

  const rooms = getAllRooms(devices);
  const roomDevices = getRoomDevices(devices, selectedRoom);

  // Handle gesture recognition
  useEffect(() => {
    if (recognizedGesture && confidence > 0.7) {
      const command = gestureCommands.find(cmd => 
        cmd.gesture === recognizedGesture && cmd.enabled
      );
      
      if (command) {
        executeGestureCommand(command);
        setTimeout(clearGesture, 2000);
      }
    }
  }, [recognizedGesture, confidence, gestureCommands, clearGesture]);

  const executeGestureCommand = (command: GestureCommand) => {
    const device = devices.find(d => d.id === command.deviceId);
    if (!device) return;

    switch (command.action) {
      case 'turn_on':
        handleDeviceToggle(device.id, 'on');
        break;
      case 'turn_off':
        handleDeviceToggle(device.id, 'off');
        break;
      case 'toggle':
        handleDeviceToggle(device.id);
        break;
      case 'increase_temp':
        if (device.temperature !== undefined) {
          handleDeviceValueChange(device.id, Math.min(device.temperature + 2, 85));
        }
        break;
      case 'decrease_temp':
        if (device.temperature !== undefined) {
          handleDeviceValueChange(device.id, Math.max(device.temperature - 2, 60));
        }
        break;
    }

    // Send command to Arduino
    if (isConnected) {
      sendCommand(JSON.stringify({
        deviceId: device.id,
        action: command.action,
        value: device.value
      }));
    }
  };

  const handleDeviceToggle = (deviceId: string, forcedStatus?: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = forcedStatus || (device.status === 'on' ? 'off' : 'on');
        return {
          ...device,
          status: newStatus as Device['status'],
          lastUpdated: new Date()
        };
      }
      return device;
    }));
  };

  const handleDeviceValueChange = (deviceId: string, value: number) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const updates: Partial<Device> = {
          lastUpdated: new Date()
        };
        
        if (device.type === 'light') {
          updates.brightness = value;
        } else if (device.type === 'thermostat') {
          updates.temperature = value;
        }
        
        return { ...device, ...updates };
      }
      return device;
    }));
  };

  const lastMessage = messages.length > 0 ? messages[messages.length - 1].data : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Home Control</h1>
                <p className="text-sm text-gray-500">Gesture-Controlled Automation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'devices'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Devices
                </button>
                <button
                  onClick={() => setActiveTab('gestures')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'gestures'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Gestures
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Settings
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'devices' && (
          <div className="space-y-6">
            {/* Room Selector */}
            <RoomSelector
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
              rooms={rooms}
            />

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {roomDevices.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={() => handleDeviceToggle(device.id)}
                  onValueChange={handleDeviceValueChange}
                />
              ))}
            </div>

            {roomDevices.length === 0 && (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-500">No devices are configured for this room.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gestures' && (
          <div className="space-y-6">
            {/* Gesture Control Area */}
            <GestureArea
              isRecording={isRecording}
              gesturePoints={gesturePoints}
              recognizedGesture={recognizedGesture}
              confidence={confidence}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onAddPoint={addPoint}
              onClearGesture={clearGesture}
            />

            {/* Gesture Commands */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Configured Gestures</h3>
              <div className="space-y-3">
                {gestureCommands.map(command => (
                  <div
                    key={command.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{command.name}</p>
                      <p className="text-sm text-gray-600">{command.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        command.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {command.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Arduino Connection */}
            <SerialConnection
              isConnected={isConnected}
              onConnect={connect}
              onDisconnect={disconnect}
              error={error}
              lastMessage={lastMessage}
            />

            {/* Settings Panel */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Gesture Sensitivity</h4>
                    <p className="text-sm text-gray-600">Adjust gesture recognition sensitivity</p>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-32"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-connect Arduino</h4>
                    <p className="text-sm text-gray-600">Automatically connect on startup</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Voice Commands</h4>
                    <p className="text-sm text-gray-600">Enable voice control (coming soon)</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled
                    className="w-4 h-4 text-gray-400 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Device Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total Devices</p>
                  <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Active Devices</p>
                  <p className="text-2xl font-bold text-green-600">
                    {devices.filter(d => d.status === 'on').length}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Rooms</p>
                  <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Gestures</p>
                  <p className="text-2xl font-bold text-purple-600">{gestureCommands.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;