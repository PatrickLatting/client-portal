import React from 'react';
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

/**
 * A reusable carousel component for displaying property images
 * @param {Object} props
 * @param {string} props.googleEarthUrl - URL for Google Earth image
 * @param {string} props.googleMapsUrl - URL for Google Maps Street View image
 * @param {string} props.address - Property address for alt text
 */
const PropertyImageCarousel = ({ googleEarthUrl, googleMapsUrl, address }:any) => {
  const images = [
    {
      url: googleEarthUrl,
      alt: `Satellite view of ${address}`
    },
    {
      url: googleMapsUrl,
      alt: `Street view of ${address}`
    }
  ];

  return (
    <Carousel className=" w-fit max-h-min mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-2">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

// Example usage:


export default PropertyImageCarousel;