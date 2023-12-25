import { z } from 'zod';

export const decode = <T>(data: unknown, codec: z.Schema<T>) => {
  return codec.parse(data);
};
