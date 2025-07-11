export interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'security' | 'door' | 'window' | 'fan' | 'outlet';
  status: 'on' | 'off' | 'locked' | 'unlocked' | 'open' | 'closed';
  value?: number;
  room: string;
  lastUpdated: Date;
  color?: string;
  brightness?: number;
  temperature?: number;
}

export interface GestureCommand {
  id: string;
  name: string;
  gesture: string;
  deviceId: string;
  action: string;
  description: string;
  enabled: boolean;
}

export interface Room {
  id: string;
  name: string;
  devices: Device[];
  temperature?: number;
  humidity?: number;
}

export interface SerialMessage {
  type: 'gesture' | 'device' | 'status' | 'error';
  data: any;
  timestamp: Date;
}

export interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
}