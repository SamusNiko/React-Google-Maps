import { GET_LOCATIONS } from '@/constants';

export function getLocations(data) {
  return {
    type: GET_LOCATIONS,
    payload: data
  };
}
