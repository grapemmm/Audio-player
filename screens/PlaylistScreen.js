import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import commonStyle from '../styles/commonStyle';

const tracks = [
  { id: '1', title: 'Track 1' },
  { id: '2', title: 'Track 2' },
  { id: '3', title: 'Track 3' },
  { id: '4', title: 'Track 4' },
  { id: '5', title: 'Track 5' },
  { id: '6', title: 'Track 6' },
  { id: '7', title: 'Track 7' },
  { id: '8', title: 'Track 8' },
  { id: '9', title: 'Track 9' },
  { id: '10', title: 'Track 10' },
];

export default function PlaylistScreen({ navigation }) {
  const handleTrackPress = (index) => {
    navigation.navigate('Home', { trackIndex: index });
  };

  return (
    <View style={commonStyle.container}>
      <Text style={commonStyle.title}>Playlist</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleTrackPress(index)} style={commonStyle.itemContainer}>
            <Text style={commonStyle.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


