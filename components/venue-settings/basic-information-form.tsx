'use client';

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
import { venueBasicInformationSchema } from '@/lib/form-schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '../ui/select';
import { organizationTypeEnum, roleEnum, Venue } from '@/lib/types';
import { US_STATES } from '@/lib/constants';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAuth, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

import { updateVenue } from '@/lib/actions/update-venue';
import { LoadingView } from '../loading-view';

interface Props {
  venue: any;
}

export function BasicInformationForm({ venue }: Props) {
  const { isLoaded, orgId, orgRole } = useAuth();
  const { organization, isLoaded: isVenueLoaded } = useOrganization();
  const [image, setImage] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof venueBasicInformationSchema>>({
    resolver: zodResolver(venueBasicInformationSchema),
    defaultValues: {
      name: '',
      type: '',
      city: '',
      state: '',
      address: '',
      established: '',
      website: '',
      description: '',
      image: undefined,
    },
  });

  useEffect(() => {
    if (venue) {
      form.reset({
        name: venue.name,
        type: venue.type,
        city: venue.city,
        state: venue.state,
        address: venue.address,
        established: venue.established,
        website: venue.website,
        description: venue.description,
      });
    }
  }, [venue, form]);

  const updateVenueConvex = useMutation(api.venues.updateVenue);

  const onSubmit = async (
    values: z.infer<typeof venueBasicInformationSchema>
  ) => {
    if (!isLoaded || !orgId) {
      toast.error('Not loaded or venue id not found');
      return;
    }

    if (orgRole !== roleEnum.ADMIN) {
      toast.error('You are not authorized to update basic information');
      return;
    }

    if (values.image) {
      if (isVenueLoaded) {
        const res = await organization?.setLogo({ file: values.image });

        if (!res?.id) {
          toast.error('Failed to upload image');
          return;
        }
      }
    }

    if (values.name) {
      // update organization name using clerk api
      const res = await updateVenue({
        organizationId: orgId,
        name: values.name,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }
    }

    // update organization name using convex
    const { image, ...venueValues } = values;
    const res = await updateVenueConvex({
      externalOrgId: orgId,
      ...venueValues,
    });

    if (res.success) {
      toast.success('Venue information updated successfully');
      form.reset(values);
    } else {
      toast.error(res.message);
    }
  };

  const removeImage = () => {
    form.setValue('image', undefined);
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isLoaded || !isVenueLoaded) {
    return <LoadingView />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Building2 className="w-6 h-6" />{' '}
        <h2 className="text-lg font-semibold">Basic Information</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 "
        >
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      setImage(file);
                    }}
                  />
                  <div className="flex items-center justify-center">
                    {image ? (
                      <div className="flex items-center gap-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="Venue image"
                          width={100}
                          height={100}
                          className="w-[300px] h-[300px] object-contain"
                        />
                        <Button variant="outline" onClick={removeImage}>
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center w-full h-32 border border-dashed border-gray-300 rounded-lg cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Click to upload image
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Venue Types</SelectLabel>
                          {Object.values(organizationTypeEnum).map((type) => (
                            <SelectItem key={type} value={type}>
                              <span className="capitalize">{type}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>States</SelectLabel>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              <span className="capitalize">{state}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="established"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Established</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Year" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://www.my-venue.com" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[100px]"
                    placeholder="Description"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isDirty && !image}>
            {form.formState.isSubmitting ? 'Updating...' : 'Update Information'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
