import { GET_LOCATIONS, GET_CLUSTERS } from '@/constants';

const initialState = {
  locations: [],
  clusters: []
};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    case GET_CLUSTERS:
      return {
        ...state,
        clusters: action.payload
      };
    default: {
      return state;
    }
  }
}
