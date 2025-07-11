import { Device, GestureCommand } from '../types';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Main Ceiling Light',
    type: 'light',
    status: 'on',
    room: 'Living Room',
    brightness: 75,
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Smart Thermostat',
    type: 'thermostat',
    status: 'on',
    room: 'Living Room',
    temperature: 72,
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Security System',
    type: 'security',
    status: 'locked',
    room: 'Living Room',
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Bedroom Light',
    type: 'light',
    status: 'off',
    room: 'Bedroom',
    brightness: 50,
    lastUpdated: new Date()
  },
  {
    id: '5',
    name: 'Kitchen Light',
    type: 'light',
    status: 'on',
    room: 'Kitchen',
    brightness: 90,
    lastUpdated: new Date()
  },
  {
    id: '6',
    name: 'Garage Door',
    type: 'door',
    status: 'closed',
    room: 'Garage',
    lastUpdated: new Date()
  },
  {
    id: '7',
    name: 'Ceiling Fan',
    type: 'fan',
    status: 'on',
    room: 'Bedroom',
    lastUpdated: new Date()
  },
  {
    id: '8',
    name: 'Smart Outlet',
    type: 'outlet',
    status: 'on',
    room: 'Kitchen',
    lastUpdated: new Date()
  }
];

export const mockGestureCommands: GestureCommand[] = [
  {
    id: '1',
    name: 'Turn On Lights',
    gesture: 'swipe_right',
    deviceId: '1',
    action: 'turn_on',
    description: 'Swipe right to turn on living room lights',
    enabled: true
  },
  {
    id: '2',
    name: 'Turn Off Lights',
    gesture: 'swipe_left',
    deviceId: '1',
    action: 'turn_off',
    description: 'Swipe left to turn off living room lights',
    enabled: true
  },
  {
    id: '3',
    name: 'Increase Temperature',
    gesture: 'swipe_up',
    deviceId: '2',
    action: 'increase_temp',
    description: 'Swipe up to increase thermostat temperature',
    enabled: true
  },
  {
    id: '4',
    name: 'Decrease Temperature',
    gesture: 'swipe_down',
    deviceId: '2',
    action: 'decrease_temp',
    description: 'Swipe down to decrease thermostat temperature',
    enabled: true
  },
  {
    id: '5',
    name: 'Toggle Security',
    gesture: 'circle',
    deviceId: '3',
    action: 'toggle',
    description: 'Draw a circle to toggle security system',
    enabled: true
  }
];

export const getRoomDevices = (devices: Device[], room: string): Device[] => {
  return devices.filter(device => device.room === room);
};

export const getAllRooms = (devices: Device[]): string[] => {
  return Array.from(new Set(devices.map(device => device.room)));
};