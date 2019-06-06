import GET_LOCATIONS from '@/constants/actions';

function getLocations(data) {
  return {
    type: GET_LOCATIONS,
    payload: data
  };
}

export default getLocations;
