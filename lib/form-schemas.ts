import { z } from 'zod';

export const requestAccessFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  venue: z.string().min(1),
  address: z.string().min(1),
});
