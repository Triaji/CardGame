import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit';
import cardsReducer from '@models/Card/Slice';
import stepReducer from '@models/Step/Slice';

const rootReducer = combineReducers({
  cards: cardsReducer,
  step: stepReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
