import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      {/* Banner Images */}
      <img src={assets.bottom_banner_image} alt="banner" className="w-full hidden md:block" />
      <img src={assets.bottom_banner_image_sm} alt="banner" className="w-full md:hidden" />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
        <div className="p-6 rounded-md max-w-xl bg-pvt">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            Why We Are the Best
          </h1>

          {/* Feature List */}
          {(features || []).map((feature, index) => (
            <div key={index} className="flex items-start bg-primary-dull gap-4 mt-4">
              <img src={feature.icon} alt={feature.title} className="md:w-11 w-9" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-500/70 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;

