import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import { CardState } from '@models/Card/Slice';
import { cardBack } from '@assets/Images';

type Props = {
  card: CardState;
  reset?: Boolean;
  onPress: (value: CardState) => void;
};

const Card = (props: Props) => {
  const { card, onPress } = props;
  const [prevState, setPrevState] = useState<CardState>();
  const flip = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const flipToFrontStyle = {
    transform: [
      { perspective: 1000 },
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
      { perspective: 1000 },
      {
        rotateY: flip.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const shakeStyle = {
    transform: [{ translateX: shake }],
  };

  const flipToFront = useCallback(() => {
    Animated.spring(flip, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [flip]);

  const flipToBack = useCallback(() => {
    Animated.spring(flip, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [flip]);

  const shakeAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shake]);

  const flipCard = useCallback(() => {
    onPress && onPress(card);
  }, [onPress, card]);

  useEffect(() => {
    if (card.flipped) {
      flipToFront();
    } else {
      if (prevState?.flipped) {
        if (!prevState?.matched) {
          shakeAnimation();
        }
        setTimeout(
          () => {
            flipToBack();
          },
          !prevState?.matched ? 500 : 0,
        );
      }
    }

    setPrevState(card);
  }, [card, prevState, flipToFront, flipToBack, shakeAnimation]);

  return (
    <TouchableWithoutFeedback
      testID="touchable-card"
      style={[styles.container]}
      onPress={() => flipCard()}>
      <Animated.View style={[styles.cardContainer, { ...shakeStyle }]}>
        <Animated.View
          style={[styles.card, styles.cardFront, { ...flipToBackStyle }]}>
          <Text style={styles.cardText}>{card.value}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.card, styles.cardBack, { ...flipToFrontStyle }]}>
          <Image
            source={cardBack}
            style={styles.cardBackImage}
            resizeMode="stretch"
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: { flex: 1, padding: 5 },
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
  cardText: {
    fontFamily: 'Silkscreen-Regular',
    fontSize: 40,
  },
  cardBackImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
});

export default Card;
