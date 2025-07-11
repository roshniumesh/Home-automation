# Gesture-Controlled Home Automation

A modern web-based home automation system that uses gesture recognition and Arduino integration to control smart devices throughout your home.

## Features

- **Gesture Recognition**: Control devices using intuitive hand gestures
- **Arduino Integration**: Real-time communication with Arduino via Web Serial API
- **Smart Device Management**: Control lights, thermostats, security systems, and more
- **Room-based Organization**: Organize devices by room for easy management
- **Real-time Feedback**: Instant visual feedback for all actions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Supported Gestures

- **Swipe Right**: Turn on lights
- **Swipe Left**: Turn off lights
- **Swipe Up**: Increase temperature
- **Swipe Down**: Decrease temperature
- **Circle**: Toggle security system
- **Tap**: Select/activate device

## Hardware Requirements

### Arduino Setup
- Arduino Uno/Nano/ESP32
- Relay modules for device control
- Optional: APDS-9960 gesture sensor
- Optional: Temperature/humidity sensors

### Pin Configuration
- Digital pins 2-9: Relay outputs
- Analog pins A0-A5: Sensor inputs
- I2C pins (SDA/SCL): Gesture sensor

## Installation

### Web Application
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Arduino Setup
1. Install required libraries:
   - ArduinoJson
   - Wire (included with Arduino IDE)
2. Upload the `gesture_control.ino` sketch to your Arduino
3. Connect your relay modules and sensors according to the pin configuration

## Usage

1. **Connect Arduino**: Click "Connect Arduino" and select your device's COM port
2. **Select Room**: Choose which room's devices you want to control
3. **Use Gestures**: Draw gestures in the gesture area to control devices
4. **Monitor Status**: View real-time device status and connection information

## Gesture Commands

The system recognizes the following gesture patterns:

| Gesture | Action | Description |
|---------|--------|-------------|
| Swipe Right | Turn On | Activates lights or devices |
| Swipe Left | Turn Off | Deactivates lights or devices |
| Swipe Up | Increase | Raises temperature or brightness |
| Swipe Down | Decrease | Lowers temperature or brightness |
| Circle | Toggle | Switches security system on/off |
| Tap | Select | Selects or activates device |

## Device Types

- **Lights**: Control brightness and on/off state
- **Thermostat**: Adjust temperature settings
- **Security System**: Arm/disarm security
- **Doors**: Open/close garage doors
- **Fans**: Control ceiling fans
- **Outlets**: Smart outlet control

## Development

### Project Structure
```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── data/              # Mock data and utilities
├── arduino/           # Arduino sketch files
└── App.tsx           # Main application component
```

### Technologies Used
- React with TypeScript
- Tailwind CSS for styling
- Web Serial API for Arduino communication
- Lucide React for icons
- Vite for development and building

## Browser Support

The Web Serial API is supported in:
- Chrome 89+
- Edge 89+
- Opera 75+

Note: Firefox and Safari do not currently support the Web Serial API.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the hardware connections
2. Verify Arduino is properly connected
3. Ensure browser supports Web Serial API
4. Check console for error messages

## Future Enhancements

- Voice command integration
- Machine learning for gesture recognition
- Mobile app companion
- Cloud synchronization
- Advanced automation rules
- Integration with popular smart home platforms