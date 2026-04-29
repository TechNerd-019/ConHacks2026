import board
import busio
import adafruit_dht
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# DHT22 on GPIO4
dht = adafruit_dht.DHT22(board.D4)

# ADS1115 over I2C
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
water_level = AnalogIn(ads, 0)
soil_moisture = AnalogIn(ads, 1)

try:
    temp_c = dht.temperature
    humidity = dht.humidity
    print(f'Temperature: {temp_c:.1f}°C / {temp_c * 9/5 + 32:.1f}°F')
    print(f'Humidity:    {humidity:.1f}%')
except RuntimeError as e:
    print(f'DHT22 read error: {e}')

print(f'Water Level: {water_level.value} raw  ({water_level.voltage:.2f}V)')
print(f'Soil Moisture: {soil_moisture.value} raw  ({soil_moisture.voltage:.2f}V)')

dht.exit()
