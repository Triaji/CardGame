import React, { useEffect, useCallback } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '@components/Card';
import Screen from '@components/Screen';
import { incrementStep, resetStep, selectStep } from '@models/Step/Slice';
import {
  setCards,
  flipCard,
  unflipCards,
  unflipCardsAll,
  selectCards,
  matchCards,
  CardState,
} from '@models/Card/Slice';
import { useAppSelector, useAppDispatch } from '@utils/Hooks';

export const CARD_PAIRS_VALUE = () => {
  const numbers = [];
  while (numbers.length < 6) {
    const r = Math.floor(Math.random() * 100) + 1;
    if (numbers.indexOf(r) === -1) {
      numbers.push(r);
    }
  }

  const pairs = [...numbers, ...numbers];
  pairs.sort(() => Math.random() - 0.5);

  return pairs;
};

const GameScreen = () => {
  const step = useAppSelector(selectStep);
  const cards = useAppSelector(selectCards);
  const dispatch = useAppDispatch();

  const reset = useCallback(() => {
    const pairs = CARD_PAIRS_VALUE();
    dispatch(
      setCards(
        pairs.map((pair, index) => ({
          id: index,
          value: pair,
          flipped: false,
          matched: false,
        })),
      ),
    );
    dispatch(resetStep());
  }, [dispatch]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const pairs = [...cards];
    const pairsUnpaired = pairs.filter(pair => pair.flipped && !pair.matched);

    if (pairsUnpaired.length === 2) {
      if (pairsUnpaired[0].value !== pairsUnpaired[1].value) {
        setTimeout(() => {
          dispatch(unflipCards(pairsUnpaired.map(pair => pair.id)));
        }, 500);
      } else {
        dispatch(matchCards(pairsUnpaired.map(pair => pair.id)));
      }
    }

    if (
      cards.length > 0 &&
      pairs.filter(
        pair =>
          (!pair.matched && pair.flipped) || (!pair.matched && !pair.flipped),
      ).length === 0
    ) {
      Alert.alert(
        'Congratulations!',
        `You have successfully paired up all the cards in ${step} steps!`,
        [
          {
            text: 'Try another round',
            onPress: () => {
              reset();
            },
          },
        ],
      );
    }
  }, [cards, dispatch, step, reset]);

  const renderCardGrid = useCallback(() => {
    const onPressCard = (card: CardState) => {
      dispatch(flipCard(card.id));
      if (!card?.matched && !card?.flipped) {
        dispatch(incrementStep());
      }
    };

    const grid = [];
    for (let i = 0; i < cards.length; i += 3) {
      const row = cards.slice(i, i + 3);
      grid.push(row);
    }

    return (
      <View style={styles.gridContainer}>
        {grid?.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gridRow}>
            {row?.map((item, itemIndex) => (
              <Card
                onPress={onPressCard}
                key={`card-${rowIndex}-${itemIndex}`}
                card={item}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }, [cards, dispatch]);

  const matchCounter = useCallback(() => {
    const pairs = [...cards];
    const pairsMatched = pairs.filter(pair => pair.matched)?.length;

    return pairsMatched / 2;
  }, [cards]);

  return (
    <Screen>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.headerContainer}>
        <View style={styles.resetContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            testID="button-reset"
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                'You will lose your current game progress if you reset',
                [
                  { text: 'No' },
                  {
                    text: 'Yes',
                    onPress: () => {
                      dispatch(unflipCardsAll());
                      setTimeout(() => {
                        reset();
                      }, 1000);
                    },
                  },
                ],
              );
            }}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>
            STEPS <Text style={styles.textHighlight}>{step}</Text>
          </Text>
        </View>
      </View>

      {renderCardGrid()}

      <View style={styles.footerContainer}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>
            MATCHED {matchCounter()}/{cards.length / 2}
          </Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    backgroundColor: '#FFCC00',
    alignItems: 'center',
  },
  buttonText: { fontFamily: 'Silkscreen-Regular' },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  resetContainer: { flex: 1 },
  stepsContainer: { flex: 3, alignItems: 'flex-end', padding: 5 },
  stepsText: {
    fontFamily: 'Silkscreen-Regular',
    fontSize: 18,
    color: '#FFF',
  },
  textHighlight: { color: '#FFCC00' },
  gridContainer: { flex: 1, flexDirection: 'column' },
  gridRow: { flex: 1, flexDirection: 'row' },
  footerContainer: { height: 50, padding: 5, alignItems: 'center' },
});

export default GameScreen;
