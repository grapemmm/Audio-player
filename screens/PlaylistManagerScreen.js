import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyle from '../styles/commonStyle';
import { Ionicons } from '@expo/vector-icons';

const allTracks = [
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

const PlaylistManagerScreen = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [expandedPlaylists, setExpandedPlaylists] = useState({});

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const playlistKeys = keys.filter((key) => key.startsWith('playlist_'));
      const storedPlaylists = await AsyncStorage.multiGet(playlistKeys);
      const loadedPlaylists = storedPlaylists.map(([key, value]) => ({
        name: key.replace('playlist_', ''),
        tracks: JSON.parse(value),
      }));
      setPlaylists(loadedPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const createPlaylist = async () => {
    const newPlaylistName = `Playlist ${playlists.length + 1}`;
    const newPlaylist = { name: newPlaylistName, tracks: [] };
    try {
      await AsyncStorage.setItem(`playlist_${newPlaylistName}`, JSON.stringify(newPlaylist.tracks));
      setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const togglePlaylistExpansion = (playlistName) => {
    setExpandedPlaylists((prevState) => ({
      ...prevState,
      [playlistName]: !prevState[playlistName],
    }));
  };

  const deletePlaylist = async (playlistName) => {
    try {
      await AsyncStorage.removeItem(`playlist_${playlistName}`);
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.name !== playlistName)
      );
      if (selectedPlaylist?.name === playlistName) {
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const addTrackToPlaylist = async (track) => {
    if (!selectedPlaylist) {
      Alert.alert('No playlist selected', 'Please select a playlist to add a track.');
      return;
    }
    const updatedPlaylist = {
      ...selectedPlaylist,
      tracks: [...selectedPlaylist.tracks, track],
    };
    try {
      await AsyncStorage.setItem(
        `playlist_${selectedPlaylist.name}`,
        JSON.stringify(updatedPlaylist.tracks)
      );
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.name === selectedPlaylist.name ? updatedPlaylist : playlist
        )
      );
      setSelectedPlaylist(updatedPlaylist);
    } catch (error) {
      console.error('Error adding track to playlist:', error);
    }
  };

  const deleteTrackFromPlaylist = async (trackToDelete) => {
    if (!selectedPlaylist) return;
    const updatedTracks = selectedPlaylist.tracks.filter(
      (track) => track.id !== trackToDelete.id
    );
    const updatedPlaylist = { ...selectedPlaylist, tracks: updatedTracks };
    try {
      await AsyncStorage.setItem(
        `playlist_${selectedPlaylist.name}`,
        JSON.stringify(updatedPlaylist.tracks)
      );
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.name === selectedPlaylist.name ? updatedPlaylist : playlist
        )
      );
      setSelectedPlaylist(updatedPlaylist);
    } catch (error) {
      console.error('Error removing track from playlist:', error);
    }
  };

  const playPlaylist = (playlist) => {
    if (!playlist || playlist.tracks.length === 0) {
      Alert.alert('No tracks to play', 'Please add some tracks to the selected playlist.');
      return;
    }
    console.log('passing tracks', playlist.tracks);

    console.log('receiving params with tracks', playlist.tracks);
    navigation.navigate('Home', { customPlaylist: playlist.tracks, trackIndex: 0 }); // Передаем плейлист
  };

  return (
    <View style={commonStyle.container}>
      <Text style={commonStyle.title}>Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={commonStyle.itemContainer}>
            <View style={commonStyle.playlistHeaderContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPlaylist(item);
                  togglePlaylistExpansion(item.name);
                }}
                style={{ flex: 1 }}
              >
                <Text style={commonStyle.text}>{item.name}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => playPlaylist(item)} style={commonStyle.iconButton}>
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletePlaylist(item.name)} style={commonStyle.iconButton}>
                  <Ionicons name="trash" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            {expandedPlaylists[item.name] && (
              <View style={{ marginTop: 10 }}>
                <Text style={commonStyle.text}>Tracks in {item.name}</Text>
                {item.tracks.length > 0 ? (
                  <FlatList
                    data={item.tracks}
                    keyExtractor={(track, index) => `${track.id || index}`}
                    renderItem={({ item: track }) => (
                      <View style={commonStyle.itemContainer}>
                        <Text style={commonStyle.text}>{track.title || `Track ${track.id || ''}`}</Text>
                        <TouchableOpacity onPress={() => deleteTrackFromPlaylist(track)} style={commonStyle.iconButton}>
                          <Ionicons name="trash" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                ) : (
                  <Text style={commonStyle.text}>No tracks in this playlist.</Text>
                )}
                <Text style={commonStyle.title}>Add Tracks</Text>
                <FlatList
                  data={allTracks}
                  keyExtractor={(track) => track.id}
                  renderItem={({ item: track }) => (
                    <TouchableOpacity
                      onPress={() => addTrackToPlaylist(track)}
                      style={commonStyle.itemContainer}
                    >
                      <Text style={commonStyle.text}>{track.title}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        )}
      />
      <TouchableOpacity onPress={createPlaylist} style={commonStyle.button}>
        <Text style={commonStyle.buttonText}>Create New Playlist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaylistManagerScreen;








