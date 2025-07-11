import { useState, useEffect, useCallback } from 'react';
import { SerialMessage } from '../types';

export const useWebSerial = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SerialMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      if (!navigator.serial) {
        throw new Error('Web Serial API not supported');
      }

      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      
      setPort(selectedPort);
      setIsConnected(true);
      setError(null);

      // Start reading data
      const reader = selectedPort.readable?.getReader();
      if (reader) {
        readLoop(reader);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (port) {
      await port.close();
      setPort(null);
      setIsConnected(false);
    }
  }, [port]);

  const sendCommand = useCallback(async (command: string) => {
    if (!port || !port.writable) return;

    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(command + '\n'));
    writer.releaseLock();
  }, [port]);

  const readLoop = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const message: SerialMessage = {
                type: 'status',
                data: JSON.parse(line),
                timestamp: new Date()
              };
              setMessages(prev => [...prev.slice(-99), message]);
            } catch {
              // If not JSON, treat as plain text
              const message: SerialMessage = {
                type: 'status',
                data: line,
                timestamp: new Date()
              };
              setMessages(prev => [...prev.slice(-99), message]);
            }
          }
        }
      }
    } catch (err) {
      setError('Connection lost');
      setIsConnected(false);
    } finally {
      reader.releaseLock();
    }
  };

  return {
    isConnected,
    connect,
    disconnect,
    sendCommand,
    messages,
    error
  };
};