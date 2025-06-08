import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, Play, Clock, Flame, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: string;
  calories: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  participants?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string[];
}

export default function WorkoutsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All',
      icon: <Users size={20} color="#ffffff" strokeWidth={2} />,
      color: '#6B7280',
      gradient: ['#6B7280', '#4B5563'],
    },
    {
      id: 'strength',
      name: 'Strength',
      icon: <Users size={20} color="#ffffff" strokeWidth={2} />,
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#A855F7'],
    },
    {
      id: 'cardio',
      name: 'Cardio',
      icon: <Users size={20} color="#ffffff" strokeWidth={2} />,
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      id: 'yoga',
      name: 'Yoga',
      icon: <Users size={20} color="#ffffff" strokeWidth={2} />,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
    },
    {
      id: 'hiit',
      name: 'HIIT',
      icon: <Users size={20} color="#ffffff" strokeWidth={2} />,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
    },
  ];

  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Full Body HIIT Blast',
      category: 'hiit',
      duration: '25 min',
      calories: '300',
      difficulty: 'Intermediate',
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      participants: '12.5k',
    },
    {
      id: '2',
      name: 'Upper Body Strength',
      category: 'strength',
      duration: '45 min',
      calories: '280',
      difficulty: 'Advanced',
      image: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      participants: '8.7k',
    },
    {
      id: '3',
      name: 'Morning Yoga Flow',
      category: 'yoga',
      duration: '30 min',
      calories: '150',
      difficulty: 'Beginner',
      image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      participants: '15.2k',
    },
    {
      id: '4',
      name: 'Cardio Dance Party',
      category: 'cardio',
      duration: '35 min',
      calories: '320',
      difficulty: 'Intermediate',
      image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      participants: '9.8k',
    },
    {
      id: '5',
      name: 'Core & Abs Crusher',
      category: 'strength',
      duration: '20 min',
      calories: '180',
      difficulty: 'Intermediate',
      image: 'https://images.pexels.com/photos/4761668/pexels-photo-4761668.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      participants: '6.4k',
    },
    {
      id: '6',
      name: 'Leg Day Destroyer',
      category: 'strength',
      duration: '50 min',
      calories: '400',
      difficulty: 'Advanced',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      participants: '7.1k',
    },
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
        <Text style={styles.headerSubtitle}>Find your perfect workout</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workouts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#8B5CF6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            <View style={styles.categoriesList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && styles.categoryCardActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  {selectedCategory === category.id ? (
                    <LinearGradient colors={category.gradient} style={styles.categoryGradient}>
                      <View style={styles.categoryIcon}>
                        {category.icon}
                      </View>
                      <Text style={styles.categoryNameActive}>{category.name}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.categoryContent}>
                      <View style={[styles.categoryIconInactive, { backgroundColor: `${category.color}15` }]}>
                        {React.cloneElement(category.icon as React.ReactElement, { color: category.color })}
                      </View>
                      <Text style={styles.categoryNameInactive}>{category.name}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Workout List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Workouts' : `${categories.find(c => c.id === selectedCategory)?.name} Workouts`}
          </Text>
          <View style={styles.exerciseGrid}>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseImageContainer}>
                  <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
                  <View style={styles.exerciseOverlay}>
                    <TouchableOpacity style={styles.playButton}>
                      <Play size={16} color="#ffffff" strokeWidth={2} />
                    </TouchableOpacity>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                      <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseStats}>
                    <View style={styles.exerciseStat}>
                      <Clock size={14} color="#6B7280" strokeWidth={2} />
                      <Text style={styles.exerciseStatText}>{exercise.duration}</Text>
                    </View>
                    <View style={styles.exerciseStat}>
                      <Flame size={14} color="#EF4444" strokeWidth={2} />
                      <Text style={styles.exerciseStatText}>{exercise.calories} cal</Text>
                    </View>
                    {exercise.participants && (
                      <View style={styles.exerciseStat}>
                        <Users size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.exerciseStatText}>{exercise.participants}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginHorizontal: -24,
  },
  categoriesList: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 100,
  },
  categoryCardActive: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryGradient: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  categoryContent: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryNameActive: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  categoryNameInactive: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  exerciseGrid: {
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  exerciseImageContainer: {
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
  },
  exerciseOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  exerciseInfo: {
    padding: 20,
  },
  exerciseName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 16,
  },
  exerciseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});