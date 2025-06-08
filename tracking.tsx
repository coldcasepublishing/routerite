import React, { useState, useEffect } from 'react';
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
import { MapPin, Clock, Navigation, Phone, MessageCircle, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Loader, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Vehicle {
  id: number;
  driver: string;
  phone: string;
  vehicleNumber: string;
  location: {
    lat: number;
    lng: number;
    progress: number;
  };
}

interface Stop {
  type: 'Pickup' | 'Dropoff';
  address: string;
  time: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  estimatedArrival?: string;
}

interface Trip {
  id: number;
  status: 'In Progress' | 'Completed';
  vehicle: Vehicle;
  stops: Stop[];
  currentStopIndex: number;
}

export default function TrackingScreen() {
  const { tripId } = useLocalSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadTripData();
    const interval = setInterval(updateTripProgress, 5000);
    return () => clearInterval(interval);
  }, [tripId]);

  const loadTripData = () => {
    // Mock trip data - in real app this would come from API
    const mockTrip: Trip = {
      id: parseInt(tripId as string) || 101,
      status: 'In Progress',
      vehicle: {
        id: 1,
        driver: 'Michael Johnson',
        phone: '+1 (501) 555-0123',
        vehicleNumber: 'RR-001',
        location: {
          lat: 34.5853,
          lng: -92.3824,
          progress: 0.6
        }
      },
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
          status: 'In Progress',
          estimatedArrival: '10:58'
        },
        { 
          type: 'Pickup', 
          address: '321 Elm St, Bryant, AR', 
          time: '11:30', 
          status: 'Pending',
          estimatedArrival: '11:35'
        },
        { 
          type: 'Dropoff', 
          address: '654 Spruce Ln, Bryant, AR', 
          time: '12:00', 
          status: 'Pending',
          estimatedArrival: '12:05'
        }
      ],
      currentStopIndex: 1
    };
    setTrip(mockTrip);
  };

  const updateTripProgress = () => {
    if (!trip) return;
    
    // Simulate vehicle movement
    setTrip(prevTrip => {
      if (!prevTrip) return null;
      
      const newProgress = Math.min(prevTrip.vehicle.location.progress + 0.1, 1);
      
      return {
        ...prevTrip,
        vehicle: {
          ...prevTrip.vehicle,
          location: {
            ...prevTrip.vehicle.location,
            progress: newProgress
          }
        }
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10B981';
      case 'In Progress':
        return '#F59E0B';
      case 'Pending':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} color="#10B981" strokeWidth={2} />;
      case 'In Progress':
        return <Loader size={16} color="#F59E0B" strokeWidth={2} />;
      case 'Pending':
        return <Clock size={16} color="#6B7280" strokeWidth={2} />;
      default:
        return <Clock size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  const isRunningLate = (scheduledTime: string, estimatedTime?: string) => {
    if (!estimatedTime) return false;
    
    const scheduled = new Date(`2024-01-01T${scheduledTime}:00`);
    const estimated = new Date(`2024-01-01T${estimatedTime}:00`);
    
    return estimated > scheduled;
  };

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Loader size={48} color="#005a9c" strokeWidth={2} />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  const currentStop = trip.stops[trip.currentStopIndex];
  const nextStop = trip.stops[trip.currentStopIndex + 1];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#005a9c', '#003b64']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Live Tracking</Text>
            <Text style={styles.headerSubtitle}>Trip #{trip.id}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              {trip.status === 'In Progress' ? (
                <Loader size={24} color="#F59E0B" strokeWidth={2} />
              ) : (
                <CheckCircle size={24} color="#10B981" strokeWidth={2} />
              )}
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {trip.status === 'In Progress' ? 'Trip in Progress' : 'Trip Completed'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {currentStop ? `${currentStop.type} at ${currentStop.address}` : 'All stops completed'}
              </Text>
            </View>
          </View>

          {currentStop && currentStop.estimatedArrival && (
            <View style={[
              styles.estimatedArrival,
              { backgroundColor: isRunningLate(currentStop.time, currentStop.estimatedArrival) ? '#FEF2F2' : '#F0FDF4' }
            ]}>
              <View style={styles.arrivalIcon}>
                {isRunningLate(currentStop.time, currentStop.estimatedArrival) ? (
                  <AlertTriangle size={16} color="#EF4444" strokeWidth={2} />
                ) : (
                  <CheckCircle size={16} color="#10B981" strokeWidth={2} />
                )}
              </View>
              <Text style={[
                styles.arrivalText,
                { color: isRunningLate(currentStop.time, currentStop.estimatedArrival) ? '#EF4444' : '#10B981' }
              ]}>
                {isRunningLate(currentStop.time, currentStop.estimatedArrival) 
                  ? `Running late - ETA ${currentStop.estimatedArrival}`
                  : `On time - ETA ${currentStop.estimatedArrival}`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Map Container */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Live Map</Text>
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2' }}
              style={styles.mapBackground}
            />
            
            {/* Vehicle Marker */}
            <View style={[
              styles.vehicleMarker,
              { 
                left: `${20 + (trip.vehicle.location.progress * 60)}%`,
                top: `${30 + (trip.vehicle.location.progress * 40)}%`
              }
            ]}>
              <View style={styles.vehicleIcon}>
                <Navigation size={16} color="#ffffff" strokeWidth={2} />
              </View>
              <Text style={styles.vehicleLabel}>Vehicle {trip.vehicle.vehicleNumber}</Text>
            </View>

            {/* Stop Markers */}
            {trip.stops.map((stop, index) => (
              <View
                key={index}
                style={[
                  styles.stopMarker,
                  { 
                    left: `${15 + (index * 20)}%`,
                    top: `${25 + (index * 15)}%`
                  }
                ]}
              >
                <View style={[
                  styles.stopIcon,
                  { 
                    backgroundColor: stop.type === 'Pickup' ? '#10B981' : '#EF4444',
                    opacity: stop.status === 'Completed' ? 1 : 0.6
                  }
                ]}>
                  <Text style={styles.stopNumber}>{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverSection}>
          <Text style={styles.sectionTitle}>Your Driver</Text>
          <View style={styles.driverCard}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
              style={styles.driverPhoto}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{trip.vehicle.driver}</Text>
              <Text style={styles.vehicleInfo}>Vehicle: {trip.vehicle.vehicleNumber}</Text>
              <Text style={styles.driverPhone}>{trip.vehicle.phone}</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color="#005a9c" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#005a9c" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Trip Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Trip Progress</Text>
          <View style={styles.progressContainer}>
            {trip.stops.map((stop, index) => (
              <View key={index} style={styles.progressItem}>
                <View style={styles.progressIndicator}>
                  <View style={[
                    styles.progressDot,
                    { 
                      backgroundColor: getStatusColor(stop.status),
                      borderColor: stop.status === 'In Progress' ? '#F59E0B' : 'transparent',
                      borderWidth: stop.status === 'In Progress' ? 3 : 0
                    }
                  ]} />
                  {index < trip.stops.length - 1 && (
                    <View style={[
                      styles.progressLine,
                      { backgroundColor: index < trip.currentStopIndex ? '#10B981' : '#E5E7EB' }
                    ]} />
                  )}
                </View>
                <View style={styles.progressDetails}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressType}>{stop.type}</Text>
                    <View style={styles.progressStatus}>
                      {getStatusIcon(stop.status)}
                      <Text style={[styles.progressStatusText, { color: getStatusColor(stop.status) }]}>
                        {stop.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.progressAddress}>{stop.address}</Text>
                  <View style={styles.progressTiming}>
                    <Text style={styles.progressTime}>Scheduled: {stop.time}</Text>
                    {stop.estimatedArrival && (
                      <Text style={[
                        styles.progressETA,
                        { color: isRunningLate(stop.time, stop.estimatedArrival) ? '#EF4444' : '#10B981' }
                      ]}>
                        ETA: {stop.estimatedArrival}
                      </Text>
                    )}
                  </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    marginRight: 16,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  statusSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  estimatedArrival: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  arrivalIcon: {
    marginRight: 4,
  },
  arrivalText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  mapSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  mapContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  mapBackground: {
    width: '100%',
    height: '100%',
  },
  vehicleMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#005a9c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  vehicleLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  stopMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  stopNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#ffffff',
  },
  driverSection: {
    marginTop: 24,
  },
  driverCard: {
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
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
  },
  vehicleInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  driverPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#005a9c',
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  progressItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  progressIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  progressDetails: {
    flex: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  progressStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressStatusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  progressAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressTiming: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressETA: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
});