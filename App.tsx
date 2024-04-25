import React, { useState } from 'react';
import { Button, View, Text, SafeAreaView } from 'react-native';

const API_KEY = 'PASTE_YOUR_KEY_HERE';
const CITY_NAME = 'Bengaluru'; 
const customWaitTime = 5000; 

const testProps = (input: any) => { return {
  testID: input, accessibilityLabel: input
}};

const Data = ({title, value}: any) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
      <Text style={{color: 'gray', fontSize: 22}}>{title}</Text>
      <Text style={{color: 'gray', fontSize: 22}}>{value}</Text>
    </View>
  );

const App = () => {
  const [weather, setWeather] = useState(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const toogleWeather = () => {
    if (weather) {
      setWeather(null);
    } else {
      fetchWeatherData();
    }
  };

  const fetchWeatherData = () => {
    setFetchingWeather(true);
    setTimeout(() => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
      )
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
          return response.json();
        })
        .then(data => {
          console.log('Weather data:', data);
          setWeather(data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        })
        .finally(() => {
          setFetchingWeather(false);
        });
      }, customWaitTime);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 50 , padding: 10}}>
        <Text {...testProps('helloText')} style={{ fontSize: 20, textAlign: 'center', padding: 10 }}>Welcome to Bengaluru</Text>
        {weather !== null && (
          <View style={{padding: 22}} {...testProps('weatherDetails')}>
            <Data title="Temperature" value={`${weather['main']['temp']}°C`} />
            <Data title="Humidity" value={`${weather['main']['humidity']}%`} />
            <Data title="Wind Speed" value={`${weather['wind']['speed']} m/s`} />
          </View>
        )}
        <Button
          title={fetchingWeather ? 'Fetching Weather...' : weather ? 'Hide Weather' : 'Check Weather'}
          color={fetchingWeather ? 'gray' : weather ? 'orange' : 'green'}
          disabled={fetchingWeather}
          onPress={() => toogleWeather()}
          {...testProps('checkWeatherButton')}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;
