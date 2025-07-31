import { SerializedError } from '@reduxjs/toolkit';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: SerializedError | null;
}
