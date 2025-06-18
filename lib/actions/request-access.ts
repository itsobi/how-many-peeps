'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { requestAccessFormSchema } from '../form-schemas';

const resend = new Resend(process.env.RESEND_API_KEY);

export const requestAccess = async (
  values: z.infer<typeof requestAccessFormSchema>
) => {
  const formValues = requestAccessFormSchema.safeParse(values);

  if (!formValues.success) {
    throw new Error('Invalid form data');
  }
  const { name, email, venue } = values;

  const { error } = await resend.emails.send({
    from: 'How Many Peeps <onboarding@resend.dev>',
    to: [process.env.MY_EMAIL!],
    subject: 'Requesting Access',
    html: `<p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Venue: ${venue}</p>`,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Request sent successfully' };
};
