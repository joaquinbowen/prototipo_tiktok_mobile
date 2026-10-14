import { useState, useRef, useCallback } from 'react';
import {
  View, FlatList, Dimensions, StyleSheet, Text,
  TouchableOpacity, ViewToken, LayoutChangeEvent,
} from 'react-native';
import { VideoCard } from '@/components/VideoCard';
import { VideoSidebar } from '@/components/VideoSidebar';
import { VIDEOS } from '@/data/mocks';
import { COLORS } from '@/constants/colors';
import { FONT, SPACING } from '@/constants/layout';

const { width } = Dimensions.get('window');
type TabType = 'paraти' | 'siguiendo';

export default function FeedScreen() {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('paraти');
  const [likes, setLikes] = useState<Record<string, number>>(
    Object.fromEntries(VIDEOS.map(v => [v.id, v.likes]))
  );
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });

  function handleLike(videoId: string) {
    const wasLiked = liked[videoId] ?? false;
    setLiked(prev => ({ ...prev, [videoId]: !wasLiked }));
    setLikes(prev => ({
      ...prev,
      [videoId]: wasLiked ? prev[videoId] - 1 : prev[videoId] + 1,
    }));
  }

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height: h } = e.nativeEvent.layout;
    if (h > 0 && h !== containerHeight) {
      setContainerHeight(h);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Feed tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => setActiveTab('siguiendo')} activeOpacity={0.8}>
          <Text style={[styles.tab, activeTab === 'siguiendo' && styles.tabActive]}>
            Siguiendo
          </Text>
          {activeTab === 'siguiendo' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('paraти')} activeOpacity={0.8}>
          <Text style={[styles.tab, activeTab === 'paraти' && styles.tabActive]}>
            Para Ti
          </Text>
          {activeTab === 'paraти' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Video list with exact viewport height calibration */}
      {containerHeight > 0 && (
        <FlatList
          data={VIDEOS}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={{ width, height: containerHeight, overflow: 'hidden' }}>
              <VideoCard video={item} isActive={index === activeIndex} cardHeight={containerHeight} />
              <VideoSidebar
                likes={likes[item.id] ?? item.likes}
                comments={item.comments}
                shares={item.shares}
                saves={item.saves}
                isLiked={liked[item.id] ?? false}
                onLike={() => handleLike(item.id)}
                authorAvatarColor={item.avatar}
              />
            </View>
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={containerHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          getItemLayout={(_, index) => ({
            length: containerHeight,
            offset: containerHeight * index,
            index,
          })}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          windowSize={3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    overflow: 'hidden',
  },
  tabsRow: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  tab: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.medium,
    color: 'rgba(255,255,255,0.55)',
    paddingBottom: 6,
  },
  tabActive: {
    color: COLORS.white,
    fontWeight: FONT.weight.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.white,
  },
});
