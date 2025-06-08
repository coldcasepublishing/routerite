import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock, MapPin, Calendar, ChevronRight, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Loader } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

interface Trip {
  id: number;
  date: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  vehicleId?: number;
  estimatedDuration: string;
  stops: Stop[];
}

interface Stop {
  type: 'Pickup' | 'Dropoff';
  address: string;
  time: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  coordinates?: { lat: number; lng: number };
}

export default function MyTripsScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadTrips();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const loadTrips = () => {
    // Mock data - in real app this would come from API
    const mockTrips: Trip[] = [
      {
        id: 101,
        date: new Date().toISOString().split('T')[0],
        status: 'In Progress',
        vehicleId: 1,
        estimatedDuration: '45 min',
        stops: [
          { 
            type: 'Pickup', 
            address: '789 Maple Ave, Bryant, AR', 
            time: '10:30', 
            status: 'Completed' 
          },
          { 
            type: 'Dropoff', 
            address: '101 Birch Rd, Bryant, AR', 
            time: '10:55', 
            status: 'In Progress' 
          },
          { 
            type: 'Pickup', 
            address: '321 Elm St, Bryant, AR', 
            time: '11:30', 
            status: 'Pending' 
          },
          { 
            type: 'Dropoff', 
            address: '654 Spruce Ln, Bryant, AR', 
            time: '12:00', 
            status: 'Pending' 
          }
        ]
      },
      {
        id: 102,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'Upcoming',
        estimatedDuration: '30 min',
        stops: [
          { 
            type: 'Pickup', 
            address: '123 Main St, Little Rock, AR', 
            time: '09:00', 
            status: 'Pending' 
          },
          { 
            type: 'Dropoff', 
            address: 'UAMS Medical Center, Little Rock, AR', 
            time: '09:45', 
            status: 'Pending' 
          }
        ]
      },
      {
        id: 103,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        status: 'Completed',
        estimatedDuration: '25 min',
        stops: [
          { 
            type: 'Pickup', 
            address: 'Walmart Supercenter, Bryant, AR', 
            time: '14:00', 
            status: 'Completed' 
          },
          { 
            type: 'Dropoff', 
            address: '789 Maple Ave, Bryant, AR', 
            time: '14:20', 
            status: 'Completed' 
          }
        ]
      }
    ];
    setTrips(mockTrips);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadTrips();
      setRefreshing(false);
    }, 1000);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return '#3B82F6';
      case 'In Progress':
        return '#F59E0B';
      case 'Completed':
        return '#10B981';
      case 'Cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return <Clock size={16} color="#3B82F6" strokeWidth={2} />;
      case 'In Progress':
        return <Loader size={16} color="#F59E0B" strokeWidth={2} />;
      case 'Completed':
        return <CheckCircle size={16} color="#10B981" strokeWidth={2} />;
      case 'Cancelled':
        return <AlertCircle size={16} color="#EF4444" strokeWidth={2} />;
      default:
        return <Clock size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleTrackTrip = (tripId: number) => {
    router.push({
      pathname: '/tracking',
      params: { tripId: tripId.toString() }
    });
  };

  const upcomingTrips = trips.filter(trip => 
    trip.status === 'Upcoming' || trip.status === 'In Progress'
  );
  const pastTrips = trips.filter(trip => 
    trip.status === 'Completed' || trip.status === 'Cancelled'
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#005a9c', '#003b64']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.appName}>ROUTE RITE</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{ 
                uri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' 
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/schedule')}
            >
              <LinearGradient colors={['#10B981', '#059669']} style={styles.quickActionGradient}>
                <Calendar size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.quickActionText}>Schedule Trip</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/tracking')}
            >
              <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.quickActionGradient}>
                <MapPin size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.quickActionText}>Track Live</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Trips</Text>
            {upcomingTrips.map((trip) => (
              <TouchableOpacity key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripDateContainer}>
                    <Text style={styles.tripDate}>{formatDate(trip.date)}</Text>
                    <Text style={styles.tripDuration}>{trip.estimatedDuration}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(trip.status)}15` }]}>
                    {getStatusIcon(trip.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
                      {trip.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.stopsContainer}>
                  {trip.stops.map((stop, index) => (
                    <View key={index} style={styles.stopItem}>
                      <View style={styles.stopIndicator}>
                        <View style={[
                          styles.stopDot,
                          { 
                            backgroundColor: stop.type === 'Pickup' ? '#10B981' : '#EF4444',
                            opacity: stop.status === 'Completed' ? 1 : 0.3
                          }
                        ]} />
                        {index < trip.stops.length - 1 && <View style={styles.stopLine} />}
                      </View>
                      <View style={styles.stopDetails}>
                        <View style={styles.stopHeader}>
                          <Text style={styles.stopType}>{stop.type}</Text>
                          <Text style={styles.stopTime}>{stop.time}</Text>
                        </View>
                        <Text style={styles.stopAddress}>{stop.address}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {trip.status === 'In Progress' && (
                  <TouchableOpacity 
                    style={styles.trackButton}
                    onPress={() => handleTrackTrip(trip.id)}
                  >
                    <Play size={16} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.trackButtonText}>Track Live</Text>
                    <ChevronRight size={16} color="#ffffff" strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            {pastTrips.slice(0, 3).map((trip) => (
              <TouchableOpacity key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripDateContainer}>
                    <Text style={styles.tripDate}>{formatDate(trip.date)}</Text>
                    <Text style={styles.tripDuration}>{trip.estimatedDuration}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(trip.status)}15` }]}>
                    {getStatusIcon(trip.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
                      {trip.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.stopsContainer}>
                  {trip.stops.map((stop, index) => (
                    <View key={index} style={styles.stopItem}>
                      <View style={styles.stopIndicator}>
                        <View style={[
                          styles.stopDot,
                          { backgroundColor: stop.type === 'Pickup' ? '#10B981' : '#EF4444' }
                        ]} />
                        {index < trip.stops.length - 1 && <View style={styles.stopLine} />}
                      </View>
                      <View style={styles.stopDetails}>
                        <View style={styles.stopHeader}>
                          <Text style={styles.stopType}>{stop.type}</Text>
                          <Text style={styles.stopTime}>{stop.time}</Text>
                        </View>
                        <Text style={styles.stopAddress}>{stop.address}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {trips.length === 0 && (
          <View style={styles.emptyState}>
            <MapPin size={64} color="#9CA3AF" strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>No trips scheduled</Text>
            <Text style={styles.emptyStateText}>
              Schedule your first trip to get started with ROUTE RITE
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/schedule')}
            >
              <Text style={styles.emptyStateButtonText}>Schedule Trip</Text>
            </TouchableOpacity>
          </View>
        )}
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  quickActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  tripCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripDateContainer: {
    flex: 1,
  },
  tripDate: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  tripDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  stopsContainer: {
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stopIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stopLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  stopDetails: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stopType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#374151',
  },
  stopTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#005a9c',
  },
  stopAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  trackButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#005a9c',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});