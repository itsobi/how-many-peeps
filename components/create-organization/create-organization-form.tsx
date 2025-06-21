'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingView } from '../loading-view';
import { useOrganizationList } from '@clerk/nextjs';
import { toast } from 'sonner';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { useRef } from 'react';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1),
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

export default function CreateOrganizationForm() {
  const { isLoaded, createOrganization, setActive } = useOrganizationList();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: undefined,
    },
  });

  const handleCreateOrganization = async (
    values: z.infer<typeof formSchema>
  ) => {
    if (!createOrganization) {
      return {
        success: false,
        error: 'Create organization function not available',
      };
    }

    try {
      // Create the organization
      const newOrganization = await createOrganization({ name: values.name });

      // Set the newly created organization as active (synchronous)
      setActive({ organization: newOrganization.id });

      // Set the logo for the newly created organization
      if (values.image) {
        try {
          await newOrganization.setLogo({ file: values.image });
        } catch (logoError) {
          console.error('Failed to set organization logo:', logoError);
          return {
            success: true, // Organization was created, but logo failed
            message:
              'Organization created, but failed to set organization logo',
            name: values.name,
          };
        }
      }

      return {
        success: true,
        message: 'Organization created successfully',
        name: values.name,
      };
    } catch (error) {
      console.error('Error creating organization:', error);
      return {
        success: false,
        error: isClerkAPIResponseError(error)
          ? error.errors[0].longMessage
          : 'Failed to create organization',
      };
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!createOrganization) return;

    toast.promise(handleCreateOrganization(values), {
      loading: 'Creating organization...',
      success: (data) => {
        form.reset();
        return `${data?.name || 'Organization'} created successfully`;
      },
      error: (error) => {
        if (isClerkAPIResponseError(error)) {
          return error.errors[0].longMessage;
        }
        return 'Failed to create organization';
      },
    });
  };

  if (!isLoaded) {
    return <LoadingView />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    placeholder="Image"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    accept="image/jpeg,image/png"
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <div className="flex items-center gap-4">
                    {field.value ? (
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="Organization Logo"
                        width={100}
                        height={100}
                        className="rounded object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex justify-center items-center border rounded border-dashed p-4 cursor-pointer"
                      >
                        <Upload />
                      </button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      PNG or JPEG (max. 10MB)
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </Form>
  );
}
