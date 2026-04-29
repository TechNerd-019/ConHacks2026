from flask import Flask, jsonify
from flask_cors import CORS
import board, busio, adafruit_dht
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

app = Flask(__name__)
CORS(app)

dht = adafruit_dht.DHT22(board.D4)
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
water_level = AnalogIn(ads, 0)
soil_moisture = AnalogIn(ads, 1)

@app.route('/sensors')
def get_sensors():
    data = {}
    try:
        temp_c = dht.temperature
        data['temperature_c'] = round(temp_c, 1)
        data['temperature_f'] = round(temp_c * 9/5 + 32, 1)
        data['humidity'] = round(dht.humidity, 1)
    except RuntimeError:
        data['temperature_c'] = None
        data['temperature_f'] = None
        data['humidity'] = None

    data['water_level'] = {'raw': water_level.value, 'voltage': round(water_level.voltage, 2)}
    data['soil_moisture'] = {'raw': soil_moisture.value, 'voltage': round(soil_moisture.voltage, 2)}
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
