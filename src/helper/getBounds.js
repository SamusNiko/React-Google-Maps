export function getMapBounds(refs) {
  const bounds = {
    ne: {
      lat: refs.map
        .getBounds()
        .getNorthEast()
        .lat(),
      lng: refs.map
        .getBounds()
        .getNorthEast()
        .lng()
    },
    nw: {
      lat: refs.map
        .getBounds()
        .getNorthEast()
        .lat(),
      lng: refs.map
        .getBounds()
        .getSouthWest()
        .lng()
    },
    se: {
      lat: refs.map
        .getBounds()
        .getSouthWest()
        .lat(),
      lng: refs.map
        .getBounds()
        .getNorthEast()
        .lng()
    },
    sw: {
      lat: refs.map
        .getBounds()
        .getSouthWest()
        .lat(),
      lng: refs.map
        .getBounds()
        .getSouthWest()
        .lng()
    }
  };
  return bounds;
}
