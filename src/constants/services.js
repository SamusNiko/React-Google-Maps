export const mapURL = `https://maps.googleapis.com/maps/api/js?key=
${process.env.REACT_APP_GOOGLE_MAPS_KEY}&v=3.exp&libraries=geometry,
drawing,places`;

export const verifyPassword = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
  process.env.REACT_APP_FIREBASE_API_KEY
}`;

export const signupNewUser = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
  process.env.REACT_APP_FIREBASE_API_KEY
}`;

export const dataBaseURL = `https://react-googl-maps.firebaseio.com/`;
