from flask import Flask, jsonify, request
from flask_cors import CORS
import board, busio, adafruit_dht
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import snowflake.connector
import google.generativeai as genai
from gpiozero import LED as GPIOLed
import re

app = Flask(__name__)
CORS(app)

dht = adafruit_dht.DHT22(board.D4)
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
water_level = AnalogIn(ads, 0)
soil_moisture = AnalogIn(ads, 1)
plant_light = GPIOLed(13)
led_red = GPIOLed(21)
led_orange = GPIOLed(20)
led_green = GPIOLed(19)

SF_CONFIG = dict(
    account='DSQTGVS-GQ78189',
    user='HANAD11',
    password='xebkut-nyjwuN-tokdo1',
    warehouse='PLANTHUB_WH',
    database='PLANTHUB',
    schema='SENSORS'
)

genai.configure(api_key='AIzaSyCHWujqNW8BnjLYv1nmEedOGfXH0fqvai8')
model = genai.GenerativeModel('models/gemini-flash-latest')

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
    # LED alerts based on soil moisture
    if soil_moisture.value < 3000:
        led_red.on()
        led_orange.off()
        led_green.off()
    elif soil_moisture.value < 6000:
        led_red.off()
        led_orange.on()
        led_green.off()
    else:
        led_red.off()
        led_orange.off()
        led_green.on()
    return jsonify(data)

@app.route('/history')
def get_history():
    limit = request.args.get('limit', 50, type=int)
    conn = snowflake.connector.connect(**SF_CONFIG)
    cur = conn.cursor()
    cur.execute(f'SELECT timestamp, temperature_c, temperature_f, humidity, soil_moisture_raw, soil_moisture_voltage, water_level_raw, water_level_voltage FROM PLANTHUB.SENSORS.SENSOR_READINGS ORDER BY timestamp DESC LIMIT {limit}')
    cols = [d[0].lower() for d in cur.description]
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/light', methods=['GET', 'POST'])
def light():
    if request.method == 'POST':
        state = request.json.get('state', False)
        if state:
            plant_light.on()
        else:
            plant_light.off()
    return jsonify({'state': plant_light.is_lit})

@app.route('/chat', methods=['POST'])
def chat():
    user_msg = request.json.get('message', '')
    plants_context = request.json.get('plants', [])
    has_light_sensor = request.json.get('hasLightSensor', False)

    msg_lower = user_msg.lower()
    is_light_command = any(w in msg_lower for w in ['turn on light', 'turn off light', 'lights on', 'lights off', 'switch on light', 'switch off light', 'enable light', 'disable light'])

    if is_light_command:
        if not has_light_sensor:
            return jsonify({'response': 'No light sensor detected. Please add the Light sensor card first, then I can control it for you.', 'lightChanged': False})
        turn_on = any(w in msg_lower for w in ['turn on', 'lights on', 'switch on', 'enable'])
        if turn_on:
            plant_light.on()
            return jsonify({'response': 'Done! I turned the plant light on for you. 🌞', 'lightChanged': True, 'lightState': True})
        else:
            plant_light.off()
            return jsonify({'response': 'Done! I turned the plant light off. 🌙', 'lightChanged': True, 'lightState': False})

    current = {}
    try:
        temp_c = dht.temperature
        current['temperature_f'] = round(temp_c * 9/5 + 32, 1)
        current['temperature_c'] = round(temp_c, 1)
        current['humidity'] = round(dht.humidity, 1)
    except:
        pass
    current['soil_moisture'] = soil_moisture.value
    current['water_level'] = water_level.value

    history_text = ''
    try:
        conn = snowflake.connector.connect(**SF_CONFIG)
        cur = conn.cursor()
        cur.execute('SELECT timestamp, temperature_f, humidity, soil_moisture_raw, water_level_raw FROM PLANTHUB.SENSORS.SENSOR_READINGS ORDER BY timestamp DESC LIMIT 10')
        rows = cur.fetchall()
        conn.close()
        history_text = '\n'.join([f'{r[0]}: temp={r[1]}F, humidity={r[2]}%, soil={r[3]}, water={r[4]}' for r in rows])
    except:
        history_text = 'No historical data available.'

    plants_info = ''
    if plants_context:
        plants_info = "User's plants:\n"
        for p in plants_context:
            plants_info += f"- {p.get('name', 'Unknown')} ({p.get('species', 'Unknown species')})\n"

    light_status = f"Plant light is currently: {'ON' if plant_light.is_lit else 'OFF'}" if has_light_sensor else "No light sensor installed."

    prompt = (
        "You are Flora, a friendly and knowledgeable plant care assistant for the PlantHub app. "
        "You help users take care of their plants using real sensor data from their Raspberry Pi.\n\n"
        "RULES:\n"
        "- For casual messages (hi, hello, how are you, etc), respond naturally and friendly.\n"
        "- For plant-related questions, ALWAYS use the sensor data to give specific advice.\n"
        "- Keep responses concise but helpful.\n\n"
        f"CURRENT LIVE SENSOR DATA:\n"
        f"- Temperature: {current.get('temperature_f', 'N/A')}F ({current.get('temperature_c', 'N/A')}C)\n"
        f"- Humidity: {current.get('humidity', 'N/A')}%\n"
        f"- Soil Moisture (higher = wetter): {current.get('soil_moisture', 'N/A')}\n"
        f"- Water Level (higher = more water): {current.get('water_level', 'N/A')}\n"
        f"- {light_status}\n\n"
        f"RECENT HISTORY:\n{history_text}\n\n"
        f"{plants_info}\n"
        f"USER: {user_msg}\n\n"
        "Respond helpfully:"
    )

    try:
        response = model.generate_content(prompt)
        return jsonify({'response': response.text, 'lightChanged': False})
    except Exception as e:
        return jsonify({'response': 'Sorry, I had trouble processing that. Please try again.', 'lightChanged': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
