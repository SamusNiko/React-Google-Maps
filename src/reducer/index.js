import actionConst from '@/constants/actions';

const initialState = {
  favoritLocations: [],
};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case actionConst.GET_LOCATIONS:
      return {
        ...state, favoritLocations: action.payload,
      };
    default: {
      return state;
    }
  }
}
