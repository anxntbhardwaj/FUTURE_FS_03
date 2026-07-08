import { TravelPackage, FleetOption } from '../types';

export const INITIAL_PACKAGES: TravelPackage[] = [
  {
    packageId: 'spiti-valley-overland',
    title: 'Spiti Valley Overland',
    slug: 'spiti-valley-overland',
    startingPrice: 18500,
    shortDescription: 'The middle land of rugged terrains, monasteries, stargazing skies, and high-altitude silence.',
    fullDescription: 'Journey through the ancient Buddhist kingdom of Spiti, deep within the rain-shadow of the Greater Himalayas. Navigate stunning cliffside mountain loops, walk through traditional whitewashed Tibetan villages, dine inside centuries-old monasteries, and sleep beneath a galaxy of raw celestial stars in the cold desert peaks.',
    destination: 'Spiti Valley, Himachal Pradesh',
    duration: '7 Days, 6 Nights',
    isActive: true,
    isFeatured: true,
    sceneType: 'himalayas',
    heroImage: 'https://file.garden/aeySfh58aX0K8a6A/spiti',
    galleryImages: [
      'https://file.garden/aeySfh58aX0K8a6A/spiti',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=85'
    ],
    highlights: [
      'Explore Kaza and the iconic Key Monastery perched on a cliff',
      'Visit Chitkul, the last inhabited village on the Indo-Tibetan border',
      'Stand over the breathtaking Suicide Point at Kalpa',
      'Camp beside the mythical moon-lake Chandratal'
    ],
    inclusions: [
      'Luxury SUV logistics from Shimla drop to Manali',
      'Bespoke visual guided services',
      'Gourmet Himalayan homecooked meals',
      'Premium oxygen-equipped stays & dome camps'
    ],
    exclusions: [
      'Personal adventure gears',
      'Emergency rescue or evacuation fees',
      'Tips or discretionary team awards'
    ],
    itinerary: [
      { day: 1, title: 'Shimla to Sarahan', description: 'Drive along the elegant Sutlej river, ascending into the peaceful historic settlement of Sarahan. Visit the legendary timber Bhimakali Temple.' },
      { day: 2, title: 'Sangla & Chitkul Valley', description: 'Enter the dramatic gorgeous Baspa Valley. Drive directly to Chitkul to stand near the majestic Indo-Tibetan border ridges.' },
      { day: 3, title: 'Kalpa & Suicide Point', description: 'Witness the sunrise illuminating the holy Kinner Kailash peak. Stop at Kalpa\'s vertical Suicide Point cliff edge.' },
      { day: 4, title: 'Kaza via Nako & Tabo', description: 'Climb into the cold desert territory of Spiti. Walk through the thousand-year-old clay mud monastery in Tabo.' },
      { day: 5, title: 'Key Monastery & High altitude Villages', description: 'A spiritual expedition into Key Monastery. Post lunch, visit Hikkim - home to the world\'s highest post office.' },
      { day: 6, title: 'Chandratal Moon Lake', description: 'Drive past Kunzum Pass into the pristine, mirror-like emerald crescent waters of Chandratal Lake for a deluxe starlight camp.' },
      { day: 7, title: 'Drop in Manali via Atal Tunnel', description: 'Drive back through the high-engineering marvel of Atal Tunnel and conclude your luxury overland journey in Old Manali.' }
    ],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    packageId: 'kashmir-great-lakes',
    title: 'Kashmir Great Lakes',
    slug: 'kashmir-great-lakes',
    startingPrice: 24999,
    shortDescription: 'A cinematic trek through alpine lakes, meadows, snow bridges, and landscapes that feel almost unreal.',
    fullDescription: 'Enter the alpine heaven. Experience a timeless private trail across pristine multi-colored glacier feeding lakes, vast flower-dappled meadows, dramatic towering mountain passes, and tranquil pine fields where the air carries absolute purity.',
    destination: 'Srinagar to Sonamarg, Kashmir',
    duration: '7 Days, 6 Nights',
    isActive: true,
    isFeatured: true,
    sceneType: 'lakes',
    heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1589136775550-13a863704ef7?auto=format&fit=crop&w=800&q=85'
    ],
    highlights: [
      'Hike alongside 7 pristine mirror-like glacier lakes',
      'Cross the snow bridges of Thajiwas Valley',
      'Camp in premium high-altitude setups under starry skies',
      'Bespoke Kashmiri culinary curation'
    ],
    inclusions: [
      'Exquisite luxury tents and sleeping gear',
      'Verified mountain guides and horse logistics',
      'Aromatic Wazwan and fresh organic menus',
      'Required inner-line security clearances'
    ],
    exclusions: [
      'Pre-trek acclimatization hotel stays',
      'Trek gear purchases or rentals',
      'Personal porter services'
    ],
    itinerary: [
      { day: 1, title: 'Srinagar Arrival & Heritage Stay', description: 'Be greeted at Srinagar airport, then check into a luxury lakeside heritage cedar houseboat on Dal Lake.' },
      { day: 2, title: 'Sonamarg & Thajiwas Glaciers', description: 'Drive along Sind river into Sonamarg Meadow of Gold. Acclimatize with a simple hike up to the snow-fields.' },
      { day: 3, title: 'Trek to Nichnai Pass Entrance', description: 'Cross gorgeous silver birch forests and pristine sheep pastures to pitch our luxury alpine camp near Nichnai Stream.' },
      { day: 4, title: 'Vishansar Dream Lake', description: 'Summit Nichnai Pass at 13,000 ft, descending to the royal turquoise jewel of Vishansar Alpine Lake.' },
      { day: 5, title: 'Gadsar Flower Valley Pass', description: 'Cross Kishansar Lake. Hike the steep pass to gaze in awe over both twins, descending past wildflower carpets to Gadsar.' },
      { day: 6, title: 'Gangabal Lakeside Retreat', description: 'Ascend past Satsar\'s seven small tarns to stand beneath Mt. Harmukh, resting beside the large peaceful Gangabal Lake.' },
      { day: 7, title: 'Descent & Return to Srinagar', description: 'Hike down through dense green pine glades to Naranag, and drive back to Srinagar for your premium departure drop.' }
    ],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    packageId: 'royal-rajasthan',
    title: 'Royal Rajasthan',
    slug: 'royal-rajasthan',
    startingPrice: 16500,
    shortDescription: 'A royal journey through Jaipur, Pushkar, Jodhpur, Jaisalmer, golden forts, and desert nights.',
    fullDescription: 'Dine like a maharaja and travel across the golden desert dunes of Rajasthan. Explore majestic hand-carved sand forts, grand palaces reflecting light over holy lakes, historic blue alleys, and stay in deep luxury camp setups lit with soft warm campfires.',
    destination: 'Jaipur, Jodhpur, Jaisalmer',
    duration: '6 Days, 5 Nights',
    isActive: true,
    isFeatured: true,
    sceneType: 'desert',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=85'
    ],
    highlights: [
      'Private sunset champagne on Jaisalmer dunes',
      'VIP guided heritage tours inside Mehrangarh Fort',
      'Luxurious palace resort stays',
      'Traditional folk dance fireside evenings'
    ],
    inclusions: [
      'Chauffeur-driven luxury SUV transfers',
      'hotels will be selected according to your budget and desert camps',
      'Private camel and jeep safari operators',
      'All VIP monument access passes'
    ],
    exclusions: [
      'Discretionary shopping purchases',
      'Optional hot air balloon excursions',
      'Alcoholic beverages'
    ],
    itinerary: [
      { day: 1, title: 'Jaipur Forts and Pink Palace', description: 'Arrive in Jaipur. Visit Amber Fort with a heritage guide, exploring the mirrored arches of Sheesh Mahal.' },
      { day: 2, title: 'Pushkar Sacred Serenity', description: 'Drive to the ancient town of Pushkar, walking its circular holy lake ghats as local folk music drifts across temples.' },
      { day: 3, title: 'Jodhpur Blue Indigo Alleys', description: 'Traverse Jodhpur, entering Mehrangarh Fort. Wander through the beautifully painted indigo blue city alleys.' },
      { day: 4, title: 'Jaisalmer Golden Fort Outpost', description: 'Journey into the heart of Thar. Watch the sunset turn the massive organic living sandstone fort of Jaisalmer completely golden.' },
      { day: 5, title: 'Camp Thar desert safari & folk performance', description: 'Embark on a private 4x4 dune safari, check into a premium luxury tent, and feast under constellations with folk artists.' },
      { day: 6, title: 'Royal Departure', description: 'Savor a royal desert breakfast, then transfer to Jodhpur or Jaipur airport for your homeward flight.' }
    ],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    packageId: 'meghalaya-clouds',
    title: 'Meghalaya Clouds',
    slug: 'meghalaya-clouds',
    startingPrice: 21000,
    shortDescription: 'A cloud-soaked journey through waterfalls, living root bridges, Cherrapunji, and Dawki.',
    fullDescription: 'Enter the wet magical world of the Abode of Clouds. Wander through primeval, moss-covered rainforests, marvel at suspension bridges grown entirely from roots of living rubber trees, sail on the crystal-clear glass-water rivers of Dawki, and face cascading mighty waterfalls.',
    destination: 'Shillong, Cherrapunji, Dawki',
    duration: '6 Days, 5 Nights',
    isActive: true,
    isFeatured: false,
    sceneType: 'rainforest',
    heroImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=85'
    ],
    highlights: [
      'Witness the double-decker living root bridges',
      'Boating over Dawki’s clear, glass-like waters',
      'Explore Mawlynnong, cleanest village in Asia',
      'Private waterfall canyon trekking'
    ],
    inclusions: [
      'Premium boutique resort lodges',
      'Chauffeur driven private transport from Guwahati',
      'Eco-guide and local forest experts',
      'Local Khasi cuisine experiences'
    ],
    exclusions: [
      'Extra mineral water or specialty snacking',
      'Adventure zip-lining tickets',
      'Camera fee collections'
    ],
    itinerary: [
      { day: 1, title: 'Guwahati Pick-up & Shillong Drive', description: 'Scenic drive from airport past Umiam Lake into Shillong, the "Scotland of the East".' },
      { day: 2, title: 'Shillong Sightseeing', description: 'Explore local peaks, waterfalls, and the vibrant local high-quality culture.' },
      { day: 3, title: 'Cherrapunji Mist Falls', description: 'Travel along the misty ridges of Sohra. Gaze down into deep gorges at the Nohkalikai Falls.' },
      { day: 4, title: 'Double Decker Root Bridge Hike', description: 'An immersive forest valley descend down stone steps to witness ancient living suspension bridges.' },
      { day: 5, title: 'Dawki Glass Water River', description: 'Float on water so transparent your boat appears suspended in thin air. Visit Mawlynnong on return.' },
      { day: 6, title: 'Departure from Guwahati', description: 'Drive back to Guwahati airport with unforgettable emerald green forest memories.' }
    ],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    packageId: 'manali-lahaul',
    title: 'Manali & Lahaul Valley',
    slug: 'manali-lahaul',
    startingPrice: 12500,
    shortDescription: 'A premium mountain escape through Old Manali, Atal Tunnel, and Sissu.',
    fullDescription: 'Experience old wooden mountain charm wrapped inside youth luxury. From café-hopping in Cedar woods of Old Manali, driving past the high-tech engineering marvel of the Atal Tunnel, to standing underneath massive waterfalls in Lahaul Valley.',
    destination: 'Delhi, Manali, Lahaul Valley',
    duration: '6 Days, 5 Nights',
    isActive: true,
    isFeatured: false,
    sceneType: 'snow',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=85'
    ],
    highlights: [
      'Drive across Atal Tunnel to beautiful waterfall of Sissu',
      'Explore hidden cafés in Old Manali pine woods',
      'Premium winter snow slopes in Solang Valley',
      'Traditional wooden homestay experiences'
    ],
    inclusions: [
      'Premium luxury Volvo from Delhi to Manali',
      'Premium cozy boutique mountain cottages',
      'All local sightseeing by a private Thar 4x4',
      'All meals hand-selected by executive chefs'
    ],
    exclusions: [
      'Skiing or snow paragliding activities',
      'Bicycle or motorcycle rentals',
      'Cafe bar dining bills'
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Manali Volvo Journey', description: 'Board the overnight visual premium Volvo coach ascending past the Beas River.' },
      { day: 2, title: 'Old Manali Café Culture tour', description: 'Check into wooden cottages, walk the local pine forests, and visit artisanal cafés.' },
      { day: 3, title: 'Solang snow Valley Adventure', description: 'Hike into the high snow activity bowl of Solang. Try visual parallax snow photography.' },
      { day: 4, title: 'Sissu waterfall & Lahaul via Atal Tunnel', description: 'Ride through the spectacular 9km tunnel to enter Lahaul. Stand beneath freezing waterfall cords.' },
      { day: 5, title: 'Jogini Falls and Local Pine Glades', description: 'Enjoy a slow morning hike through pine forests to the stunning roaring Jogini Waterfall.' },
      { day: 6, title: 'Delhi bound Return Coach', description: 'Pack hand-woven woolens and catch the overnight premium Volvo coach back to Delhi.' }
    ],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    packageId: 'kerala-backwaters',
    title: 'Kerala Backwaters',
    slug: 'kerala-backwaters',
    startingPrice: 15200,
    shortDescription: 'A slow luxury journey through Munnar tea gardens, wildlife, and houseboats.',
    fullDescription: 'Drift past green shadows in God\'s own country. Experience pristine tea-covered mountain hills, mist-shrouded spice forests, private houseboat cruising inside lush quiet channels, and visual sunset cliffs over Varkala black sand beaches.',
    destination: 'Cochin, Munnar, Alleppey, Varkala',
    duration: '6 Days, 5 Nights',
    isActive: true,
    isFeatured: false,
    sceneType: 'backwaters',
    heroImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=85'
    ],
    highlights: [
      'Private overnight cedar wooden Houseboat cruise',
      'Misty sunrise trek through Munnar tea rows',
      'Stay in spectacular premium clifftop villas in Varkala',
      'Explore aromatic spice woodlands'
    ],
    inclusions: [
      'Premium AC transport with English guided driver',
      'hotels will be selected according to your budget and luxury clifftop stays',
      'All local meals cooked with coconut and clay-fire',
      'Private boat jetty entry permissions'
    ],
    exclusions: [
      'Optional traditional Ayurvedic massage packages',
      'Specialty seafood selections',
      'Water crafts sports at Kovalam'
    ],
    itinerary: [
      { day: 1, title: 'Cochin Arrival & Spice Port', description: 'Be welcomed at Cochin airport. Visit historic Dutch Fort and Fort Cochin coastline.' },
      { day: 2, title: 'Munnar estate valleys', description: 'Drive past waterfall loops ascending into Munnar, filled with tea leaves and cardamom aromas.' },
      { day: 3, title: 'Thekkady Spice Forest Trail', description: 'Guided walking expedition inside local spice valleys to touch real organic peppercorn, vanilla, and cocoa.' },
      { day: 4, title: 'Alleppey private Houseboat overnight', description: 'Embark on a beautifully-crafted private kettuvallam, cruising along serene backwaters as evening lanterns light up.' },
      { day: 5, title: 'Varkala Cliff Beach', description: 'Travel to Varkala to stand on the dramatic vertical red clay cliffs overlooking the vast Arabian Sea.' },
      { day: 6, title: 'Cochin drop depart', description: 'Transfer back to Cochin airport with body refreshed and peaceful coastal memories.' }
    ],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const FLEET_OPTIONS: FleetOption[] = [
  {
    vehicleId: 'innova-crysta',
    name: 'Innova Crysta (Luxury Option)',
    description: 'Premier air-conditioned utility cruiser. Excellent for long-haul comfort, high-density luggage, and reliable highway curves.',
    capacity: '6+1 Travelers',
    pricePerKm: 18,
    image: 'https://file.garden/aeySfh58aX0K8a6A/innova'
  },
  {
    vehicleId: 'thar-4x4',
    name: 'Mahindra Thar 4x4 (Adventure Choice)',
    description: 'The rugged conqueror of high-altitude gravel road tracks. Best experience for river crossings, gravel beds, or snowy trails in Spiti/Lahaul.',
    capacity: '3+1 Travelers',
    pricePerKm: 22,
    image: 'https://file.garden/aeySfh58aX0K8a6A/thar'
  },
  {
    vehicleId: 'tempo-traveller',
    name: 'Tempo Traveller (Premium Coach)',
    description: 'Bespoke modified luxury group coach featuring custom reclining captain chairs, ambient mood lighting, and high-quality sound.',
    capacity: '12-16 Travelers',
    pricePerKm: 28,
    image: 'https://file.garden/aeySfh58aX0K8a6A/tempo'
  },
  {
    vehicleId: 'sedan-cruiser',
    name: 'Urban Luxury Sedan',
    description: 'Sleek, fuel-efficient low-slung, premium executive class cruiser. Best for local city tours, smooth tarmac valleys, and quick couples vacations.',
    capacity: '4 Travelers',
    pricePerKm: 14,
    image: 'https://file.garden/aeySfh58aX0K8a6A/sedan'
  }
];
