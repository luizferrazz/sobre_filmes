import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida.', 'Por favor, conceda a permissão para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);
  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = 'e0e2a005';
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };
  return (
    <View>
      <ScrollView>
      <Text style={{ fontSize: 21, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 10}}>
      Sobre Filmes
      </Text>
      <TextInput
        style={{ borderWidth: 1, margin: 10, padding: 7}}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Procurar" onPress={handleSearch} color="black" />
      
      {movieData && (
        <View style={{ margin: 10 , alignItems: "center"}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: "center"}}>{movieData.Title}</Text>
          <Image source={{ uri: movieData.Poster }} style={{height: 300, width: 200, borderRadius: 3, alignSelf: "center"}}></Image>
          <Text style={{textAlign: "center"}}>{movieData.Year}</Text>
          <Text style={{textAlign: "center"}}>{movieData.Runtime}{'\n'}</Text>
          <Text style={{textAlign: "center"}}>Direção: {movieData.Director}</Text>
          <Text style={{textAlign: "center"}}>Elenco: {movieData.Actors}</Text>
          <Text style={{textAlign: "center"}}>Gênero: {movieData.Genre}</Text>
        </View>
      )}

      {location && (
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 30 }}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={{ alignSelf: 'center', width: '90%', height: 150, marginTop: 30}}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation = {true}
            followsUserLocation = {true}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você está aqui!"
            />
          </MapView>
        </View>
      )}
      </ScrollView>
    </View>
  );
};
export default App;