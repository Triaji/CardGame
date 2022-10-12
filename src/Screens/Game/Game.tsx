import React, {useEffect, useCallback, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import Card from '@components/Card';
import Screen from '@components/Screen';
import {incrementStep, resetStep, selectStep} from '@models/Step/Slice';
import {
  setCards,
  flipCard,
  unflipCards,
  unflipCardsAll,
  selectCards,
  matchCards,
  CardState,
} from '@models/Card/Slice';
import {useAppSelector, useAppDispatch} from '@utils/Hooks';

export const CARD_PAIRS_VALUE = () => {
  const numbers = [];
  while (numbers.length < 6) {
    const r = Math.floor(Math.random() * 100) + 1;
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }

  const pairs = [...numbers, ...numbers];
  pairs.sort(() => Math.random() - 0.5);

  return pairs.map((pair, index) => ({
    id: index,
    value: pair,
    flipped: false,
    matched: false,
  }));
};

const GameScreen = () => {
  const step = useAppSelector(selectStep);
  const cards = useAppSelector(selectCards);
  const dispatch = useAppDispatch();

  const reset = () => {
    const cc = CARD_PAIRS_VALUE();
    dispatch(setCards(cc));
    dispatch(resetStep());
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    const pairs = [...cards];
    const pairsUnpaired = pairs.filter(pair => pair.flipped && !pair.matched);

    if (pairsUnpaired.length === 2) {
      if (pairsUnpaired[0].value !== pairsUnpaired[1].value) {
        setTimeout(() => {
          dispatch(unflipCards(pairsUnpaired.map(pair => pair.id)));
        }, 1000);
      } else {
        dispatch(matchCards(pairsUnpaired.map(pair => pair.id)));
      }
    }

    console.log(pairs);

    if (
      cards.length > 0 &&
      pairs.filter(
        pair =>
          (!pair.matched && pair.flipped) || (!pair.matched && !pair.flipped),
      ).length === 0
    ) {
      Alert.alert('Congrats!');
    }
  }, [cards]);

  const onPressCard = (card: CardState) => {
    dispatch(flipCard(card.id));
    if (!card?.matched) {
      dispatch(incrementStep());
    }
  };

  const renderCardGrid = useCallback(() => {
    const grid = [];
    for (let i = 0; i < cards.length; i += 3) {
      const row = cards.slice(i, i + 3);
      grid.push(row);
    }

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {grid?.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={{flex: 1, flexDirection: 'row'}}>
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
  }, [cards]);

  return (
    <Screen>
      <View style={{height: 50, flexDirection: 'row', paddingHorizontal: 20}}>
        <View style={{flex: 1}}>
          <Button
            title="Reset"
            onPress={() => {
              dispatch(unflipCardsAll());
              setTimeout(() => {
                reset();
              }, 1000);
            }}
          />
        </View>
        <View style={{flex: 3, alignItems: 'flex-end'}}>
          <Text
            style={{
              fontFamily: 'Silkscreen-Regular',
              fontSize: 22,
              color: '#FFF',
            }}>
            STEPS:<Text>{step}</Text>
          </Text>
        </View>
      </View>

      {renderCardGrid()}
    </Screen>
  );
};

export default GameScreen;
