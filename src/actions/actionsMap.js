import { GET_LOCATIONS, GET_CLUSTERS } from '@/constants';

export function getLocations(data) {
  return {
    type: GET_LOCATIONS,
    payload: data
  };
}

export function getClustersState(data) {
  return {
    type: GET_CLUSTERS,
    payload: data
  };
}
