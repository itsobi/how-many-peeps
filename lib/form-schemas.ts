import { z } from 'zod';

export const requestAccessFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  venue: z.string().min(1),
  address: z.string().min(1),
});

export const createVenueFormSchema = z.object({
  name: z.string().trim().min(1),
  timezone: z.string().min(1, { message: 'Timezone is required' }),
});

export const venueBasicInformationSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  established: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow empty values
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Please enter a valid URL',
      }
    ),
  description: z
    .string()
    .max(500, { message: 'Description must be less than 500 characters' })
    .optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File must be 10MB or smaller.',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only JPEG or PNG files are allowed.',
    })
    .optional(),
});

export const operatingHoursSchema = z.object({
  monday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
  tuesday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
  wednesday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
  thursday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
  friday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
  saturday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
  sunday: z.object({
    closed: z.boolean(),
    open: z.string().min(1, { message: 'Opening time is required' }),
    close: z.string().min(1, { message: 'Closing time is required' }),
  }),
});

export const groupSizeSchema = z.object({
  groupSize: z
    .string()
    .min(1, { message: 'Group size is required' })
    .refine((val) => Number(val) >= 0, {
      message: 'Group size must be at least 0',
    }),
});

export const timeTrackingSchema = z.object({
  trackingTime: z
    .string()
    .min(1, { message: 'Tracking time is required' })
    .refine(
      (val) => {
        // Check if value matches HH:mm format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(val);
      },
      {
        message: 'Time must be in 24-hour format (HH:mm)',
      }
    ),
});
