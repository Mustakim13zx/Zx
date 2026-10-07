import { ModelPhoto, ModelCategory } from '../types';

import modelSizzlingBikini from '../assets/images/us_model_sizzling_beach_bikini_1790672202748.jpg';
import modelPoolsideGlamour from '../assets/images/us_model_poolside_glamour_sun_1790672219287.jpg';
import modelSunsetMalibu from '../assets/images/us_model_sunset_bikini_malibu_1790672238815.jpg';
import modelBikiniBeach from '../assets/images/us_model_beach_bikini_sunny_1790671992331.jpg';
import modelBikiniMalibu from '../assets/images/us_model_bikini_malibu_sun_1790672013582.jpg';
import modelMiamiSwimwear from '../assets/images/us_model_miami_beach_swimwear_1790672024033.jpg';
import modelHawaiiSurf from '../assets/images/us_model_hawaii_swimwear_surf_1790672044006.jpg';
import modelHawaii from '../assets/images/us_model_hawaii_beach_1790671269127.jpg';
import modelCalifornia from '../assets/images/us_model_california_sunset_1790665799677.jpg';
import modelMiamiGlamour from '../assets/images/us_model_miami_glamour_1790665817166.jpg';
import modelBeverlyHills from '../assets/images/us_model_beverly_hills_1790665852973.jpg';
import modelVegas from '../assets/images/us_model_vegas_glamour_1790671283046.jpg';
import modelStudio from '../assets/images/us_model_fashion_studio_1790665780642.jpg';
import modelTexas from '../assets/images/us_model_texas_chic_1790665870422.jpg';
import modelSF from '../assets/images/us_model_san_francisco_1790671294461.jpg';
import modelAspen from '../assets/images/us_model_aspen_winter_1790665902721.jpg';

// Core set prioritizing sizzling American bikini, swimwear and sun-drenched glamour models
const BASE_IMAGES = [
  { img: modelSizzlingBikini, category: 'beach' as ModelCategory, loc: 'Miami South Beach, Florida, USA' },
  { img: modelBikiniBeach, category: 'beach' as ModelCategory, loc: 'Malibu Beach, California, USA' },
  { img: modelPoolsideGlamour, category: 'glamour' as ModelCategory, loc: 'Beverly Hills Infinity Pool, California, USA' },
  { img: modelSunsetMalibu, category: 'beach' as ModelCategory, loc: 'Laguna Coast, California, USA' },
  { img: modelBikiniMalibu, category: 'beach' as ModelCategory, loc: 'Point Dume Beach, California, USA' },
  { img: modelMiamiSwimwear, category: 'beach' as ModelCategory, loc: 'Key West Oceanfront, Florida, USA' },
  { img: modelHawaiiSurf, category: 'beach' as ModelCategory, loc: 'Waikiki Beach, Honolulu, Hawaii, USA' },
  { img: modelHawaii, category: 'beach' as ModelCategory, loc: 'Maui Shoreline, Hawaii, USA' },
  { img: modelCalifornia, category: 'beach' as ModelCategory, loc: 'Santa Monica Beach, California, USA' },
  { img: modelMiamiGlamour, category: 'glamour' as ModelCategory, loc: 'Palm Beach Resort, Florida, USA' },
  { img: modelBeverlyHills, category: 'glamour' as ModelCategory, loc: 'Beverly Hills Luxury Villa, California, USA' },
  { img: modelVegas, category: 'glamour' as ModelCategory, loc: 'Las Vegas Strip, Nevada, USA' },
  { img: modelStudio, category: 'editorial' as ModelCategory, loc: 'SoHo Vogue Studio, New York, USA' },
  { img: modelTexas, category: 'lifestyle' as ModelCategory, loc: 'Austin Lakefront, Texas, USA' },
  { img: modelSF, category: 'lifestyle' as ModelCategory, loc: 'Pacific Coast, California, USA' },
  { img: modelAspen, category: 'glamour' as ModelCategory, loc: 'Aspen Luxury Lodge, Colorado, USA' },
];

const MODEL_NAMES = [
  'Sierra Taylor', 'Alexis Vance', 'Chloe Monet', 'Vanessa Brooks', 'Madeline Reed',
  'Hailey Morgan', 'Skylar Bennett', 'Kinsley Walker', 'Elena Sterling', 'Amber Prescott',
  'Savannah Brooks', 'Harper Wilde', 'Kennedy Cruz', 'Peyton Reed', 'Dakota Hayes',
  'Aubrey Sterling', 'Addison Raye', 'Scarlett Monroe', 'Kendall Rhodes', 'Brooklyn Stone',
  'Mackenzie Cole', 'Reagan Vance', 'Piper Holloway', 'Sydney Chandler', 'Bailey Frost',
  'Morgan Davenport', 'Hadley Mercer', 'Quinn Sullivan', 'Teagan Price', 'Riley Summers',
  'Avery Sinclair', 'Camilla Fox', 'Gia Montgomery', 'Brielle Palmer', 'Kylie West',
  'Chelsea Vance', 'Brittany Lynn', 'Danielle Rossi', 'Natalia Cruz', 'Victoria Chase',
  'Delilah Scott', 'Sienna Laurent', 'Gemma Bishop', 'Cassidy Blair', 'Paige Donovan',
  'Tatum Wilder', 'Emery Brooks', 'Finley Archer', 'Logan Sterling', 'Hayden Clarke',
  'Summer Jenkins', 'Layla Monroe', 'Carmen Hayes', 'Jocelyn Ward', 'Melanie Vance',
  'Mallory Quinn', 'Brooke Shields', 'Alicia Keyser', 'Valerie Fox', 'Tara Campbell',
  'Sabrina Knight', 'Kaitlyn Meyer', 'Taylor Swiftly', 'Ashley Olsen', 'Courtney Cox',
  'Cassandra Cain', 'Jessica Alba', 'Halston Sage', 'Bridget Satterlee', 'Alana Blanchard',
  'Megan Foxe', 'Rachel McAdams', 'Emma Stone', 'Blake Lively', 'Amber Heard',
  'Jessica Biel', 'Scarlett Rose', 'Jennifer Lawrence', 'Natalie Portman', 'Charlize Theron',
  'Margot Robbie', 'Gigi Hadid', 'Bella Hadid', 'Kendall Jenner', 'Emily Ratajkowski',
  'Kate Upton', 'Hailey Bieber', 'Barbara Palvin', 'Taylor Hill', 'Sara Sampaio',
  'Romee Strijd', 'Elsa Hosk', 'Martha Hunt', 'Lais Ribeiro', 'Jasmine Tookes',
  'Stella Maxwell', 'Josephine Skriver', 'Grace Elizabeth', 'Alexina Graham', 'Candice Swanepoel'
];

const BEACH_LOCATIONS = [
  'Miami South Beach, Florida, USA',
  'Malibu Point Dume, California, USA',
  'Beverly Hills Luxury Pool, California, USA',
  'Waikiki Beach, Honolulu, Hawaii, USA',
  'Laguna Beach, California, USA',
  'Key West Oceanfront, Florida, USA',
  'Venice Beach, California, USA',
  'Santa Monica Pier, California, USA',
  'Palm Beach Island, Florida, USA',
  'Newport Beach, California, USA',
  'Maui Ka\'anapali Coast, Hawaii, USA',
  'Clearwater Beach, Florida, USA',
  'Huntington Beach, California, USA',
  'Fort Lauderdale Beach, Florida, USA',
  'San Diego Pacific Beach, California, USA'
];

const SAMPLE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-sunbathing-at-the-beach-41484-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-walking-on-a-beach-at-sunset-41483-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-enjoying-the-summer-breeze-41485-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-futuristic-setting-42777-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-studio-with-colorful-lights-42784-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-by-the-beach-at-golden-hour-41581-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-relaxing-on-the-beach-41481-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-a-portrait-in-nature-41561-large.mp4'
];

const DURATIONS = ['00:48', '01:15', '00:52', '01:38', '02:04', '00:36', '01:22', '01:45'];

export const AMERICAN_MODELS: ModelPhoto[] = Array.from({ length: 100 }, (_, index) => {
  const base = BASE_IMAGES[index % BASE_IMAGES.length];
  const name = MODEL_NAMES[index % MODEL_NAMES.length];
  const location = BEACH_LOCATIONS[index % BEACH_LOCATIONS.length];
  const videoUrl = SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length];
  const duration = DURATIONS[index % DURATIONS.length];
  const idNum = String(index + 1).padStart(3, '0');

  const baseViews = 62000 + (index * 980) % 99000;
  const baseDownloads = Math.floor(baseViews * 0.46) + (index * 150) % 7000;
  const baseLikes = Math.floor(baseViews * 0.22) + (index * 60) % 3000;

  return {
    id: `us-model-${idNum}`,
    name,
    category: base.category,
    imageUrl: base.img,
    videoUrl,
    duration,
    aspectRatio: '3:4',
    resolution: '4K UHD (60FPS HDR)',
    location,
    views: baseViews,
    downloads: baseDownloads,
    likes: baseLikes,
    tags: [
      'Bikini & Swimwear',
      'American Model',
      'Hot Glamour',
      '4K Video Clip',
      location.split(',')[0].trim(),
      'USA'
    ],
  };
});
