import reducer, {
  addCard,
  flipCard,
  unflipCards,
  unflipCardsAll,
  setCards,
  matchCards,
  selectCards,
} from '../Slice';
import type { CardState } from '../Slice';

describe('CardSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual([]);
  });

  it('should handle a card being added to an empty list', () => {
    const previousState: CardState[] = [];

    expect(
      reducer(
        previousState,
        addCard({ id: 0, value: 50, flipped: false, matched: false }),
      ),
    ).toEqual([{ id: 0, value: 50, flipped: false, matched: false }]);
  });

  it('should handle an existing card being flipped', () => {
    const previousState: CardState[] = [
      { id: 0, value: 50, flipped: false, matched: false },
      { id: 1, value: 100, flipped: true, matched: false },
    ];

    expect(reducer(previousState, flipCard(0))).toEqual([
      { id: 0, value: 50, flipped: true, matched: false },
      { id: 1, value: 100, flipped: true, matched: false },
    ]);
  });

  it('should handle multiple existing card being unflipped', () => {
    const previousState: CardState[] = [
      { id: 0, value: 50, flipped: true, matched: false },
      { id: 1, value: 75, flipped: true, matched: false },
      { id: 2, value: 100, flipped: true, matched: false },
    ];

    expect(reducer(previousState, unflipCards([0, 1]))).toEqual([
      { id: 0, value: 50, flipped: false, matched: false },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 100, flipped: true, matched: false },
    ]);
  });

  it('should handle all existing flipped card being unflipped', () => {
    const previousState: CardState[] = [
      { id: 0, value: 50, flipped: true, matched: false },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 100, flipped: true, matched: false },
    ];

    expect(reducer(previousState, unflipCardsAll())).toEqual([
      { id: 0, value: 50, flipped: false, matched: false },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 100, flipped: false, matched: false },
    ]);
  });

  it('should handle setting cards', () => {
    const previousState: CardState[] = [];

    expect(
      reducer(
        previousState,
        setCards([
          { id: 0, value: 50, flipped: false, matched: false },
          { id: 1, value: 75, flipped: false, matched: false },
          { id: 2, value: 100, flipped: false, matched: false },
        ]),
      ),
    ).toEqual([
      { id: 0, value: 50, flipped: false, matched: false },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 100, flipped: false, matched: false },
    ]);
  });

  it('should handle matching cards', () => {
    const previousState: CardState[] = [
      { id: 0, value: 50, flipped: false, matched: false },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 50, flipped: false, matched: false },
    ];

    expect(reducer(previousState, matchCards([0, 2]))).toEqual([
      { id: 0, value: 50, flipped: false, matched: true },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 50, flipped: false, matched: true },
    ]);
  });

  it('should handle fetching cards', () => {
    const previousState: CardState[] = [
      { id: 0, value: 50, flipped: false, matched: false },
      { id: 1, value: 75, flipped: false, matched: false },
      { id: 2, value: 50, flipped: false, matched: false },
    ];

    expect(selectCards({ step: { value: 0 }, cards: previousState })).toEqual(
      previousState,
    );
  });
});
