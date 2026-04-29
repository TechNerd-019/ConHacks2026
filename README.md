# PlantHub 🌱

A React Native plant monitoring app with live sensor data from a Raspberry Pi.

## Setup

### Mobile App

```bash
npm install
npx expo run:android
```

### Raspberry Pi Sensor API

1. SSH into the Pi and set up the virtualenv:
```bash
cd ~
python3 -m venv sensors_env
source sensors_env/bin/activate
pip install flask flask-cors adafruit-circuitpython-dht adafruit-circuitpython-ads1x15
```

2. Copy `pi/sensor_api.py` to the Pi and run as a service:
```bash
sudo cp sensor_api.service /etc/systemd/system/
sudo systemctl enable --now sensor_api
```

The API serves sensor data at `http://<pi-ip>:5000/sensors`.

### Configuration

Update the API URL in `components/SensorData.tsx` to match your Pi's IP address.

## Hardware

- Raspberry Pi (any model with GPIO)
- DHT22 temperature/humidity sensor (GPIO4)
- ADS1115 ADC (I2C) with:
  - Channel 0: Water level sensor
  - Channel 1: Soil moisture sensor
