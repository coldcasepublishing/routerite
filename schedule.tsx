import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  Minus, 
  MapPin, 
  Clock, 
  Calendar,
  ChevronDown,
  X
} from 'lucide-react-native';
import { router } from 'expo-router';

interface Stop {
  id: string;
  type: 'Pickup' | 'Dropoff';
  address: string;
  time: string;
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', type: 'Pickup', address: '', time: '' },
    { id: '2', type: 'Dropoff', address: '', time: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStop = () => {
    const newStop: Stop = {
      id: Date.now().toString(),
      type: 'Pickup',
      address: '',
      time: ''
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const updateStop = (id: string, field: keyof Stop, value: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const validateForm = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date for your trip');
      return false;
    }

    for (const stop of stops) {
      if (!stop.address.trim()) {
        Alert.alert('Error', 'Please fill in all addresses');
        return false;
      }
      if (!stop.time) {
        Alert.alert('Error', 'Please fill in all times');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Trip Scheduled!',
        'Your trip has been successfully scheduled. You will receive a confirmation shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setStops([
                { id: '1', type: 'Pickup', address: '', time: '' },
                { id: '2', type: 'Dropoff', address: '', time: '' }
              ]);
              setSelectedDate(new Date().toISOString().split('T')[0]);
              router.push('/');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Text style={styles.headerTitle}>Schedule Trip</Text>
        <Text style={styles.headerSubtitle}>Plan your next journey</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Date</Text>
          <View style={styles.dateCard}>
            <View style={styles.dateHeader}>
              <Calendar size={20} color="#10B981" strokeWidth={2} />
              <Text style={styles.dateLabel}>Selected Date</Text>
            </View>
            <Text style={styles.dateValue}>{formatDate(selectedDate)}</Text>
            <TextInput
              style={styles.hiddenDateInput}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        {/* Stops Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trip Stops</Text>
            <Text style={styles.sectionSubtitle}>
              Add pickup and dropoff locations
            </Text>
          </View>

          <View style={styles.stopsContainer}>
            {stops.map((stop, index) => (
              <View key={stop.id} style={styles.stopCard}>
                <View style={styles.stopHeader}>
                  <View style={styles.stopNumber}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stopTypeContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.stopTypeButton,
                        stop.type === 'Pickup' && styles.stopTypeButtonActive
                      ]}
                      onPress={() => updateStop(stop.id, 'type', 'Pickup')}
                    >
                      <Text style={[
                        styles.stopTypeText,
                        stop.type === 'Pickup' && styles.stopTypeTextActive
                      ]}>
                        Pickup
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.stopTypeButton,
                        stop.type === 'Dropoff' && styles.stopTypeButtonActive
                      ]}
                      onPress={() => updateStop(stop.id, 'type', 'Dropoff')}
                    >
                      <Text style={[
                        styles.stopTypeText,
                        stop.type === 'Dropoff' && styles.stopTypeTextActive
                      ]}>
                        Dropoff
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {stops.length > 2 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeStop(stop.id)}
                    >
                      <X size={16} color="#EF4444" strokeWidth={2} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.stopInputs}>
                  <View style={styles.inputGroup}>
                    <View style={styles.inputIcon}>
                      <MapPin size={16} color="#6B7280" strokeWidth={2} />
                    </View>
                    <TextInput
                      style={styles.addressInput}
                      placeholder="Enter address"
                      value={stop.address}
                      onChangeText={(text) => updateStop(stop.id, 'address', text)}
                      multiline
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.inputIcon}>
                      <Clock size={16} color="#6B7280" strokeWidth={2} />
                    </View>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="HH:MM"
                      value={stop.time}
                      onChangeText={(text) => updateStop(stop.id, 'time', text)}
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addStopButton} onPress={addStop}>
              <Plus size={20} color="#10B981" strokeWidth={2} />
              <Text style={styles.addStopText}>Add Another Stop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Stops:</Text>
              <Text style={styles.summaryValue}>{stops.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Duration:</Text>
              <Text style={styles.summaryValue}>45-60 minutes</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient 
              colors={isSubmitting ? ['#9CA3AF', '#6B7280'] : ['#005a9c', '#003b64']} 
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? 'Scheduling...' : 'Schedule Trip'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  dateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dateLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#374151',
  },
  dateValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  hiddenDateInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  stopsContainer: {
    gap: 16,
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#ffffff',
  },
  stopTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  stopTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopTypeButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  stopTypeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6B7280',
  },
  stopTypeTextActive: {
    color: '#1F2937',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopInputs: {
    gap: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputIcon: {
    marginTop: 2,
  },
  addressInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    minHeight: 20,
  },
  timeInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  addStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    gap: 8,
  },
  addStopText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#10B981',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  submitSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#ffffff',
  },
});