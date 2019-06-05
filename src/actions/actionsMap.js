import actionConst from '@/constants/actions';

export function getLocations(data) {
  return {
    type: actionConst.GET_LOCATIONS,
    payload: data,
  };
}
