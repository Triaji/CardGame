import React, {useRef, useEffect} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  Image,
} from 'react-native';

import {CardState} from '@models/Card/Slice';
import {cardBack} from '@assets/Images';

type Props = {
  card: CardState;
  reset?: Boolean;
  onPress: (value: CardState) => void;
};

const Card = (props: Props) => {
  const {card, reset = false, onPress} = props;
  const flip = useRef(new Animated.Value(0)).current;
  const blip = useRef(new Animated.Value(0)).current;

  const blipSuccessStyle = blip.interpolate({
    inputRange: [0, 100],
    outputRange: ['rgba(99,71,255, 1)', 'rgba(255,99,71, 1)'],
  });

  const animatedStyle = {
    backgroundColor: blipSuccessStyle,
  };

  // const blipFailStyle = {
  //   backgroundColor: blip.interpolate({
  //     inputRange: [0, 100],
  //     outputRange: ['red', 'white'],
  //   }),
  // };

  const flipToFrontStyle = {
    transform: [
      {perspective: 1000},
      {
        rotateY: flip.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const flipToBackStyle = {
    transform: [
      {perspective: 1000},
      {
        rotateY: flip.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const flipToFront = () => {
    Animated.spring(flip, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const flipToBack = () => {
    Animated.spring(flip, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const blipSuccess = () => {
    Animated.timing(blip, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const blipFail = () => {
    Animated.timing(blip, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const flipCard = () => {
    onPress && onPress(card);
  };

  useEffect(() => {
    if (card.flipped) {
      blipSuccess();
      flipToFront();
    } else {
      flipToBack();
    }
  }, [card]);

  useEffect(() => {
    blipSuccess();
  }, []);

  return (
    <TouchableNativeFeedback
      style={[styles.container]}
      onPress={() => flipCard()}>
      <View style={{flex: 1, padding: 5}}>
        <Animated.View
          style={[styles.card, styles.cardFront, {...flipToBackStyle}]}>
          <Text
            style={{
              fontFamily: 'Silkscreen-Regular',
              fontSize: 40,
            }}>
            {card.value}
          </Text>
        </Animated.View>
        <Animated.View
          style={[styles.card, styles.cardBack, {...flipToFrontStyle}]}>
          <Image
            source={cardBack}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FFF',
            }}
            resizeMode="stretch"
          />
        </Animated.View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 10,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#FFCC00',
  },
  cardBack: {
    borderWidth: 5,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 5,
    left: 5,
  },
});

export default Card;
