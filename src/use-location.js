import { useReducer, useEffect } from "react";

const onError = error => {
  console.error(error);
};

const defaultLocation = [-34.797232, -58.232208];

const initialState = {
  bounds: { ne: defaultLocation, sw: defaultLocation },
  isLocationCentered: true,
  center: defaultLocation,
  location: defaultLocation,
  userChange: false
};

function reducer(state, action) {
  switch (action.type) {
    case "new-location":
      if (
        action.location[0] === state.location[0] &&
        action.location[1] === state.location[1]
      ) {
        return state;
      }
      if (state.isLocationCentered) {
        return {
          ...state,
          location: action.location,
          center: action.location,
          userChange: false
        };
      } else {
        return {
          ...state,
          location: action.location
        };
      }
    case "center":
      if (state.isLocationCentered) {
        return state;
      }
      return {
        ...state,
        isLocationCentered: true,
        center: state.location,
        userChange: false
      };
    case "bounds-change":
      return {
        ...state,
        bounds: action.bounds,
        isLocationCentered: !state.userChange,
        userChange: true,
        center: state.userChange ? action.center : state.location
      };
    default:
      throw new Error();
  }
}

export default function useLocation() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = ({ coords }) => {
    dispatch({
      type: "new-location",
      location: [coords.latitude, coords.longitude]
    });
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      console.error("Geolocation is not supported");
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);

  // console.log("reducer", state);
  return [state, dispatch];
}
