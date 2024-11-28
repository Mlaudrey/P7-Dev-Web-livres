const API_URL = 'http://localhost:3000';
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/login`,
  BOOKS: `${API_URL}/books`,
  BEST_RATED: `${API_URL}/books/bestrating`,
};

export const APP_ROUTES = {
  SIGN_UP: '/signup',
  SIGN_IN: '/connection',
  ADD_BOOK: '/add',
  BOOK: '/book/:id',
  UPDATE_BOOK: 'book/modify/:id',
};
