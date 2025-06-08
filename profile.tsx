import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, ChevronRight, MapPin, Calendar, Clock, Star } from 'lucide-react-native';

interface ProfileStat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const profileStats: ProfileStat[] = [
    {
      label: 'Total Trips',
      value: '47',
      icon: <MapPin size={18} color="#005a9c" strokeWidth={2} />,
      color: '#005a9c',
    },
    {
      label: 'This Month',
      value: '12',
      icon: <Calendar size={18} color="#10B981" strokeWidth={2} />,
      color: '#10B981',
    },
    {
      label: 'On Time Rate',
      value: '94%',
      icon: <Clock size={18} color="#F59E0B" strokeWidth={2} />,
      color: '#F59E0B',
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: <Star size={18} color="#EF4444" strokeWidth={2} />,
      color: '#EF4444',
    },
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          title: 'Edit Profile',
          icon: <Edit3 size={20} color="#6B7280" strokeWidth={2} />,
          onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
        },
        {
          id: 'notifications',
          title: 'Push Notifications',
          icon: <Bell size={20} color="#6B7280" strokeWidth={2} />,
          hasToggle: true,
          toggleValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'location',
          title: 'Location Services',
          icon: <MapPin size={20} color="#6B7280" strokeWidth={2} />,
          hasToggle: true,
          toggleValue: locationEnabled,
          onToggle: setLocationEnabled,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'privacy',
          title: 'Privacy & Security',
          icon: <Shield size={20} color="#6B7280" strokeWidth={2} />,
          onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
        },
        {
          id: 'help',
          title: 'Help & Support',
          icon: <HelpCircle size={20} color="#6B7280" strokeWidth={2} />,
          onPress: () => Alert.alert('Help', 'Support center coming soon!'),
        },
        {
          id: 'settings',
          title: 'App Settings',
          icon: <Settings size={20} color="#6B7280" strokeWidth={2} />,
          onPress: () => Alert.alert('Settings', 'App settings coming soon!'),
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Log Out',
          icon: <LogOut size={20} color="#EF4444" strokeWidth={2} />,
          onPress: () => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') }
              ]
            );
          },
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#005a9c', '#003b64']} style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ 
                uri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' 
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Marcus Thorne</Text>
          <Text style={styles.profileEmail}>marcus.thorne@email.com</Text>
          <Text style={styles.memberSince}>Member since January 2024</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Stats */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  {stat.icon}
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.quickActionGradient}>
                <Calendar size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.quickActionText}>Schedule Trip</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.quickActionGradient}>
                <Clock size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.quickActionText}>Trip History</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast
                  ]}
                  onPress={item.onPress}
                  disabled={item.hasToggle}
                >
                  <View style={styles.menuItemLeft}>
                    {item.icon}
                    <Text style={[
                      styles.menuItemText,
                      item.id === 'logout' && styles.menuItemTextDanger
                    ]}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.hasToggle ? (
                      <Switch
                        value={item.toggleValue}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: '#005a9c' }}
                        thumbColor={item.toggleValue ? '#ffffff' : '#ffffff'}
                      />
                    ) : (
                      <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfoCard}>
            <Text style={styles.appName}>ROUTE RITE</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Your reliable transportation companion
            </Text>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#005a9c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  memberSince: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
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
    fontSize: 14,
    color: '#ffffff',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  menuItemTextDanger: {
    color: '#EF4444',
  },
  menuItemRight: {
    marginLeft: 16,
  },
  appInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 32,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#005a9c',
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  appDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});