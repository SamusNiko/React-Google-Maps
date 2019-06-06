import GET_LOCATIONS from '@/constants/actions';

const initialState = {
  locations: []
};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    default: {
      return state;
    }
  }
}
