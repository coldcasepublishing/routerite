import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Calendar, TrendingUp, Target, Award, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProgressPhoto {
  id: string;
  date: string;
  image: string;
}

interface Measurement {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: string;
  isPositive: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

export default function ProgressScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const progressPhotos: ProgressPhoto[] = [
    {
      id: '1',
      date: 'Jan 2025',
      image: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
    },
    {
      id: '2',
      date: 'Dec 2024',
      image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
    },
    {
      id: '3',
      date: 'Nov 2024',
      image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
    },
  ];

  const measurements: Measurement[] = [
    {
      id: '1',
      label: 'Weight',
      value: '72.5',
      unit: 'kg',
      change: '-2.3',
      isPositive: true,
    },
    {
      id: '2',
      label: 'Body Fat',
      value: '18.2',
      unit: '%',
      change: '-1.8',
      isPositive: true,
    },
    {
      id: '3',
      label: 'Muscle Mass',
      value: '45.8',
      unit: 'kg',
      change: '+1.2',
      isPositive: true,
    },
    {
      id: '4',
      label: 'Waist',
      value: '82',
      unit: 'cm',
      change: '-3.5',
      isPositive: true,
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: '7 Day Streak',
      description: 'Completed workouts for 7 consecutive days',
      date: '2 days ago',
      icon: <Target size={20} color="#ffffff" strokeWidth={2} />,
      color: '#8B5CF6',
    },
    {
      id: '2',
      title: 'First 5K',
      description: 'Completed your first 5K run',
      date: '1 week ago',
      icon: <Award size={20} color="#ffffff" strokeWidth={2} />,
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Weight Goal',
      description: 'Lost 5kg towards your goal',
      date: '2 weeks ago',
      icon: <TrendingUp size={20} color="#ffffff" strokeWidth={2} />,
      color: '#F59E0B',
    },
  ];

  const timeframes = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timeframe Selector */}
        <View style={styles.section}>
          <View style={styles.timeframeContainer}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.key}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe.key && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe.key as 'week' | 'month' | 'year')}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe.key && styles.timeframeTextActive
                ]}>
                  {timeframe.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress Photos</Text>
            <TouchableOpacity style={styles.addButton}>
              <Camera size={18} color="#8B5CF6" strokeWidth={2} />
              <Text style={styles.addButtonText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            <View style={styles.photosList}>
              <TouchableOpacity style={styles.addPhotoCard}>
                <Plus size={32} color="#8B5CF6" strokeWidth={2} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
              {progressPhotos.map((photo) => (
                <View key={photo.id} style={styles.photoCard}>
                  <Image source={{ uri: photo.image }} style={styles.photoImage} />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoDate}>{photo.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Body Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Measurements</Text>
          <View style={styles.measurementsGrid}>
            {measurements.map((measurement) => (
              <View key={measurement.id} style={styles.measurementCard}>
                <Text style={styles.measurementLabel}>{measurement.label}</Text>
                <View style={styles.measurementValueContainer}>
                  <Text style={styles.measurementValue}>
                    {measurement.value}
                    <Text style={styles.measurementUnit}> {measurement.unit}</Text>
                  </Text>
                  <View style={[
                    styles.measurementChange,
                    { backgroundColor: measurement.isPositive ? '#10B98115' : '#EF444415' }
                  ]}>
                    <Text style={[
                      styles.measurementChangeText,
                      { color: measurement.isPositive ? '#10B981' : '#EF4444' }
                    ]}>
                      {measurement.change}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Stats Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Workout Sessions</Text>
              <Text style={styles.chartValue}>28 sessions</Text>
            </View>
            <View style={styles.chartContainer}>
              {/* Simple bar chart simulation */}
              {[3, 5, 4, 6, 4, 7, 5].map((value, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={[styles.chartBarFill, { height: `${(value / 7) * 100}%` }]} />
                  <Text style={styles.chartBarLabel}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                  {achievement.icon}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#8B5CF6',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  timeframeButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timeframeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  timeframeTextActive: {
    color: '#1F2937',
  },
  photosContainer: {
    marginHorizontal: -24,
  },
  photosList: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  addPhotoCard: {
    width: 120,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 8,
  },
  photoCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  photoDate: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  measurementCard: {
    width: (width - 64) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  measurementLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  measurementValueContainer: {
    alignItems: 'flex-start',
  },
  measurementValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  measurementUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  measurementChange: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  measurementChangeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  chartValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1F2937',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 8,
  },
  chartBarLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  achievementDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
});