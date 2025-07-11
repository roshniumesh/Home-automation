/*
  Gesture-Controlled Home Automation System
  
  This Arduino sketch works with the web-based gesture control interface.
  It receives gesture commands via serial communication and controls
  connected home automation devices.
  
  Hardware Requirements:
  - Arduino Uno/Nano/ESP32
  - Relay modules for device control
  - Optional: Gesture sensors (APDS-9960)
  - Optional: Temperature/humidity sensors
  
  Pin Configuration:
  - Digital pins 2-9: Relay outputs
  - Analog pins A0-A5: Sensor inputs
  - I2C pins (SDA/SCL): Gesture sensor
*/

#include <ArduinoJson.h>
#include <Wire.h>

// Device control pins
const int LIGHT_PINS[] = {2, 3, 4, 5};
const int THERMOSTAT_PIN = 6;
const int SECURITY_PIN = 7;
const int DOOR_PIN = 8;
const int FAN_PIN = 9;

// Device states
bool deviceStates[10] = {false};
int deviceValues[10] = {0};

// Timing
unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 5000;

void setup() {
  Serial.begin(9600);
  
  // Initialize device control pins
  for (int i = 0; i < 4; i++) {
    pinMode(LIGHT_PINS[i], OUTPUT);
    digitalWrite(LIGHT_PINS[i], LOW);
  }
  
  pinMode(THERMOSTAT_PIN, OUTPUT);
  pinMode(SECURITY_PIN, OUTPUT);
  pinMode(DOOR_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  
  // Initialize all pins to LOW
  digitalWrite(THERMOSTAT_PIN, LOW);
  digitalWrite(SECURITY_PIN, LOW);
  digitalWrite(DOOR_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);
  
  // Initialize I2C for sensors
  Wire.begin();
  
  // Send ready signal
  sendStatusMessage("Arduino ready for gesture control");
}

void loop() {
  // Check for incoming serial commands
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command.length() > 0) {
      processCommand(command);
    }
  }
  
  // Send periodic heartbeat
  if (millis() - lastHeartbeat > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeat = millis();
  }
  
  // Read sensors and send updates
  readSensors();
  
  delay(100);
}

void processCommand(String command) {
  // Parse JSON command
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, command);
  
  if (error) {
    sendErrorMessage("Invalid JSON command");
    return;
  }
  
  String deviceId = doc["deviceId"];
  String action = doc["action"];
  int value = doc["value"];
  
  // Execute command based on device ID
  if (deviceId == "1") {
    // Main ceiling light
    controlLight(0, action, value);
  } else if (deviceId == "2") {
    // Thermostat
    controlThermostat(action, value);
  } else if (deviceId == "3") {
    // Security system
    controlSecurity(action);
  } else if (deviceId == "4") {
    // Bedroom light
    controlLight(1, action, value);
  } else if (deviceId == "5") {
    // Kitchen light
    controlLight(2, action, value);
  } else if (deviceId == "6") {
    // Garage door
    controlDoor(action);
  } else if (deviceId == "7") {
    // Ceiling fan
    controlFan(action);
  } else if (deviceId == "8") {
    // Smart outlet
    controlOutlet(action);
  }
  
  // Send acknowledgment
  sendDeviceUpdate(deviceId, action, value);
}

void controlLight(int lightIndex, String action, int brightness) {
  if (lightIndex >= 4) return;
  
  int pin = LIGHT_PINS[lightIndex];
  
  if (action == "turn_on") {
    digitalWrite(pin, HIGH);
    deviceStates[lightIndex] = true;
    deviceValues[lightIndex] = brightness;
    
    // Use PWM for brightness control if available
    if (pin == 3 || pin == 5 || pin == 6 || pin == 9) {
      analogWrite(pin, map(brightness, 0, 100, 0, 255));
    }
  } else if (action == "turn_off") {
    digitalWrite(pin, LOW);
    deviceStates[lightIndex] = false;
    deviceValues[lightIndex] = 0;
  } else if (action == "toggle") {
    deviceStates[lightIndex] = !deviceStates[lightIndex];
    digitalWrite(pin, deviceStates[lightIndex] ? HIGH : LOW);
  }
}

void controlThermostat(String action, int temperature) {
  if (action == "increase_temp") {
    deviceValues[4] = min(deviceValues[4] + 2, 85);
  } else if (action == "decrease_temp") {
    deviceValues[4] = max(deviceValues[4] - 2, 60);
  } else if (action == "set_temp") {
    deviceValues[4] = constrain(temperature, 60, 85);
  }
  
  // Control heating/cooling relays based on temperature
  // This would connect to actual HVAC system
  digitalWrite(THERMOSTAT_PIN, deviceValues[4] > 70 ? HIGH : LOW);
}

void controlSecurity(String action) {
  if (action == "toggle") {
    deviceStates[5] = !deviceStates[5];
    digitalWrite(SECURITY_PIN, deviceStates[5] ? HIGH : LOW);
  } else if (action == "arm") {
    deviceStates[5] = true;
    digitalWrite(SECURITY_PIN, HIGH);
  } else if (action == "disarm") {
    deviceStates[5] = false;
    digitalWrite(SECURITY_PIN, LOW);
  }
}

void controlDoor(String action) {
  if (action == "toggle") {
    deviceStates[6] = !deviceStates[6];
    // Pulse the door relay
    digitalWrite(DOOR_PIN, HIGH);
    delay(500);
    digitalWrite(DOOR_PIN, LOW);
  }
}

void controlFan(String action) {
  if (action == "toggle") {
    deviceStates[7] = !deviceStates[7];
    digitalWrite(FAN_PIN, deviceStates[7] ? HIGH : LOW);
  }
}

void controlOutlet(String action) {
  if (action == "toggle") {
    deviceStates[8] = !deviceStates[8];
    // Control outlet relay (if available)
  }
}

void readSensors() {
  // Read temperature sensor (example with analog sensor)
  int tempReading = analogRead(A0);
  float temperature = (tempReading * 5.0 / 1024.0 - 0.5) * 100.0;
  
  // Read light sensor
  int lightLevel = analogRead(A1);
  
  // Send sensor data periodically
  static unsigned long lastSensorUpdate = 0;
  if (millis() - lastSensorUpdate > 2000) {
    sendSensorData(temperature, lightLevel);
    lastSensorUpdate = millis();
  }
}

void sendStatusMessage(String message) {
  StaticJsonDocument<100> doc;
  doc["type"] = "status";
  doc["message"] = message;
  doc["timestamp"] = millis();
  
  serializeJson(doc, Serial);
  Serial.println();
}

void sendErrorMessage(String error) {
  StaticJsonDocument<100> doc;
  doc["type"] = "error";
  doc["message"] = error;
  doc["timestamp"] = millis();
  
  serializeJson(doc, Serial);
  Serial.println();
}

void sendDeviceUpdate(String deviceId, String action, int value) {
  StaticJsonDocument<150> doc;
  doc["type"] = "device";
  doc["deviceId"] = deviceId;
  doc["action"] = action;
  doc["value"] = value;
  doc["timestamp"] = millis();
  
  serializeJson(doc, Serial);
  Serial.println();
}

void sendSensorData(float temperature, int lightLevel) {
  StaticJsonDocument<150> doc;
  doc["type"] = "sensor";
  doc["temperature"] = temperature;
  doc["lightLevel"] = lightLevel;
  doc["timestamp"] = millis();
  
  serializeJson(doc, Serial);
  Serial.println();
}

void sendHeartbeat() {
  StaticJsonDocument<100> doc;
  doc["type"] = "heartbeat";
  doc["uptime"] = millis();
  doc["freeMemory"] = getFreeMemory();
  
  serializeJson(doc, Serial);
  Serial.println();
}

int getFreeMemory() {
  extern int __heap_start, *__brkval;
  int v;
  return (int) &v - (__brkval == 0 ? (int) &__heap_start : (int) __brkval);
}