import * as SecureStore from 'expo-secure-store';
import { REFRESH_TOKEN_KEY } from './storageKeys';

export const getRefreshToken = () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token) =>
  SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);

export const clearRefreshToken = () =>
  SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
