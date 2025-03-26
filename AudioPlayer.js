import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, FlatList, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tracks = [
  require('./assets/music/001.mp3'),
  require('./assets/music/002.mp3'),
  require('./assets/music/003.mp3'),
  require('./assets/music/004.mp3'),
  require('./assets/music/005.mp3'),
  require('./assets/music/006.mp3'),
  require('./assets/music/007.mp3'),
  require('./assets/music/008.mp3'),
  require('./assets/music/009.mp3'),
  require('./assets/music/010.mp3'),
];

const AudioPlayer = ({ route }) => {
  const { trackIndex, customPlaylist } = route.params || {};
  const [playlist, setPlaylist] = useState(customPlaylist || tracks);
  const [sound, setSound] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(trackIndex || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const loadTrack = async (index) => {
    if (index < 0 || index >= playlist.length) {
      console.warn('Invalid track index:', index);
      return;
    }
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      let trackSource;
      if (customPlaylist && customPlaylist.length > 0) {
        const trackData = customPlaylist[index];
        if (trackData) {
          const trackId = parseInt(trackData.id, 10) - 1;
          trackSource = tracks[trackId];
        } else {
          console.error('Track data is undefined for index:', index);
          return;
        }
      } else {
        trackSource = tracks[index];
      }

      if (!trackSource) {
        console.error('Track source is undefined.');
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(trackSource);
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading track:', error);
    }
  };

  useEffect(() => {
    loadTrack(currentTrackIndex);
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (trackIndex !== undefined) {
      setCurrentTrackIndex(trackIndex);
    }
  }, [trackIndex]);

  const playPause = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
          setIsPlaying(!isPlaying);
        }
      } catch (error) {
        console.error('Error playing/pausing track:', error);
      }
    }
  };

  const nextTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
  };

  const previousTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) {
        nextTrack();
      }
    }
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value);
      } catch (error) {
        console.error('Error changing track position:', error);
      }
    }
  };

  const changeVolume = async (value) => {
    setVolume(value);
    if (sound) {
      try {
        await sound.setVolumeAsync(value);
      } catch (error) {
        console.error('Error changing volume:', error);
      }
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/music.png')}
        style={styles.albumArt}
      />
      <Text style={styles.trackInfo}>
        {customPlaylist
          ? customPlaylist[currentTrackIndex]?.title || `Track ${currentTrackIndex + 1}`
          : `Track ${currentTrackIndex + 1}`}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={onSliderValueChange}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor="#FFFFFF"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={styles.controls}>
        <Pressable onPress={previousTrack}>
          <Ionicons name="play-skip-back" size={36} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={playPause} style={styles.playPauseButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={48} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={nextTrack}>
          <Ionicons name="play-skip-forward" size={36} color="#FFFFFF" />
        </Pressable>
      </View>
      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={24} color="#FFFFFF" />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={changeVolume}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FFFFFF"
        />
        <Ionicons name="volume-high" size={24} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C2C2E',
  },
  albumArt: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  trackInfo: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
  volumeSlider: {
    width: 200,
    height: 40,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: 250,
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  timeText: {
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    width: 250,
  },
  playPauseButton: {
    padding: 10,
  },
  trackItem: {
    padding: 10,
    marginVertical: 5,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  trackText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AudioPlayer;
