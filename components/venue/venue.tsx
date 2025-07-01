'use client';

import { api } from '@/convex/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Calendar, Clock, Globe, MapPin, Pin } from 'lucide-react';
import Image from 'next/image';

interface Props {
  preloadedVenue: Preloaded<typeof api.venues.getVenue>;
}

export function Venue({ preloadedVenue }: Props) {
  const venue = usePreloadedQuery(preloadedVenue);
  console.log(venue);

  return (
    <div className="space-y-8 text-sm">
      {/* Venue Image */}
      {venue?.imageUrl && (
        <div className="flex justify-center items-center">
          <Image
            src={venue.imageUrl}
            alt={venue.name}
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>
      )}

      {/* Loaction */}
      {venue?.city && (
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground capitalize">
              {venue.city}, {venue.state}
            </p>
            <p className="text-muted-foreground">{venue.address}</p>
          </div>
        </div>
      )}

      {/* Website */}
      {venue?.website && (
        <div className="flex items-center space-x-3">
          <Globe className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Website</p>
            <a
              href={venue.website}
              className="text-blue-600 hover:text-blue-800 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {venue.website}
            </a>
          </div>
        </div>
      )}

      {/* Established */}
      {venue?.established && (
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Established</p>
            <p className="text-muted-foreground">{venue.established}</p>
          </div>
        </div>
      )}

      {/* Hours */}
      {venue?.hours && (
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Hours</p>
            <div className="text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Monday:</span>{' '}
                {venue.hours.monday.closed
                  ? 'Closed'
                  : `${venue.hours.monday.open} - ${venue.hours.monday.close}`}
              </p>
              <p>
                <span className="font-medium">Tuesday:</span>{' '}
                {venue.hours.tuesday.closed
                  ? 'Closed'
                  : `${venue.hours.tuesday.open} - ${venue.hours.tuesday.close}`}
              </p>
              <p>
                <span className="font-medium">Wednesday:</span>{' '}
                {venue.hours.wednesday.closed
                  ? 'Closed'
                  : `${venue.hours.wednesday.open} - ${venue.hours.wednesday.close}`}
              </p>
              <p>
                <span className="font-medium">Thursday:</span>{' '}
                {venue.hours.thursday.closed
                  ? 'Closed'
                  : `${venue.hours.thursday.open} - ${venue.hours.thursday.close}`}
              </p>
              <p>
                <span className="font-medium">Friday:</span>{' '}
                {venue.hours.friday.closed
                  ? 'Closed'
                  : `${venue.hours.friday.open} - ${venue.hours.friday.close}`}
              </p>
              <p>
                <span className="font-medium">Saturday:</span>{' '}
                {venue.hours.saturday.closed
                  ? 'Closed'
                  : `${venue.hours.saturday.open} - ${venue.hours.saturday.close}`}
              </p>
              <p>
                <span className="font-medium">Sunday:</span>{' '}
                {venue.hours.sunday.closed
                  ? 'Closed'
                  : `${venue.hours.sunday.open} - ${venue.hours.sunday.close}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Social Media */}
      <div className="pt-4 border-t" />
    </div>
  );
}
