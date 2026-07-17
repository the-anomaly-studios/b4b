export type School = {
  id: string;
  databaseId: string;
  slug: string;
  name: string;
  abbreviation: string;
  bandName: string;
  location: string;
  conference: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  totalScore: number;
  movement: number;
};

export type Performance = {
  id: string;
  slug: string;
  title: string;
  description: string;
  schoolId: string;
  event: string;
  recordedAt: string;
  duration: string;
  upvoteCount: number;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  featured?: boolean;
};

export const schools: School[] = [
  {
    id: "famu",
    databaseId: "10000000-0000-4000-8000-000000000001",
    slug: "florida-a-and-m",
    name: "Florida A&M University",
    abbreviation: "FAMU",
    bandName: "The Marching 100",
    location: "Tallahassee, Florida",
    conference: "SWAC",
    description:
      "Known for precision, power, and a standard of musicianship that has influenced generations of marching bands.",
    primaryColor: "#F47721",
    secondaryColor: "#007A33",
    totalScore: 28470,
    movement: 2,
  },
  {
    id: "jsu",
    databaseId: "10000000-0000-4000-8000-000000000002",
    slug: "jackson-state",
    name: "Jackson State University",
    abbreviation: "JSU",
    bandName: "Sonic Boom of the South",
    location: "Jackson, Mississippi",
    conference: "SWAC",
    description:
      "A high-impact sound and unmistakable visual style make the Sonic Boom one of the most recognized bands in the nation.",
    primaryColor: "#002147",
    secondaryColor: "#FFFFFF",
    totalScore: 27310,
    movement: -1,
  },
  {
    id: "ncat",
    databaseId: "10000000-0000-4000-8000-000000000003",
    slug: "north-carolina-a-and-t",
    name: "North Carolina A&T State University",
    abbreviation: "NCAT",
    bandName: "Blue and Gold Marching Machine",
    location: "Greensboro, North Carolina",
    conference: "CAA",
    description:
      "The Blue and Gold Marching Machine pairs musical range with crowd-moving arrangements and polished field design.",
    primaryColor: "#004684",
    secondaryColor: "#FDB927",
    totalScore: 25880,
    movement: 1,
  },
  {
    id: "southern",
    databaseId: "10000000-0000-4000-8000-000000000004",
    slug: "southern-university",
    name: "Southern University",
    abbreviation: "SU",
    bandName: "Human Jukebox",
    location: "Baton Rouge, Louisiana",
    conference: "SWAC",
    description:
      "The Human Jukebox is celebrated for a massive symphonic sound, sharp drill, and arrangements built for the stadium.",
    primaryColor: "#5B2C83",
    secondaryColor: "#F9C80E",
    totalScore: 24920,
    movement: 0,
  },
  {
    id: "bethune",
    databaseId: "10000000-0000-4000-8000-000000000005",
    slug: "bethune-cookman",
    name: "Bethune-Cookman University",
    abbreviation: "BCU",
    bandName: "Marching Wildcats",
    location: "Daytona Beach, Florida",
    conference: "SWAC",
    description:
      "A theatrical, high-energy program whose performances connect precision marching with contemporary showmanship.",
    primaryColor: "#6A1B2D",
    secondaryColor: "#F4C430",
    totalScore: 21840,
    movement: 3,
  },
  {
    id: "tennessee-state",
    databaseId: "10000000-0000-4000-8000-000000000006",
    slug: "tennessee-state",
    name: "Tennessee State University",
    abbreviation: "TSU",
    bandName: "Aristocrat of Bands",
    location: "Nashville, Tennessee",
    conference: "OVC",
    description:
      "The Grammy-winning Aristocrat of Bands carries a legacy of innovation from the field to the recording studio.",
    primaryColor: "#00539F",
    secondaryColor: "#FFFFFF",
    totalScore: 20560,
    movement: -2,
  },
];

export const performances: Performance[] = [
  {
    id: "performance-1",
    slug: "marching-100-classic-field-show",
    title: "The Marching 100 Turns the Classic Into a Statement",
    description:
      "Precision drill, layered brass, and a closing sequence that brings the entire stadium to its feet.",
    schoolId: "famu",
    event: "Florida Classic",
    recordedAt: "2026-07-12",
    duration: "8:42",
    upvoteCount: 6842,
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1800&q=85",
    imageAlt: "A marching band performing beneath bright stadium lights",
    imageCredit: "Photo by Antoine J. on Unsplash",
    featured: true,
  },
  {
    id: "performance-2",
    slug: "sonic-boom-fifth-quarter",
    title: "Sonic Boom Owns the Fifth Quarter",
    description:
      "Jackson State answers every phrase with force in a back-and-forth that keeps building.",
    schoolId: "jsu",
    event: "BoomBox Classic",
    recordedAt: "2026-07-09",
    duration: "6:18",
    upvoteCount: 5910,
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A large crowd watching a live stadium performance",
    imageCredit: "Photo by Vishnu R Nair on Unsplash",
  },
  {
    id: "performance-3",
    slug: "blue-and-gold-halftime-arrangement",
    title: "Blue and Gold Finds a New Pocket",
    description:
      "A familiar halftime favorite gets rebuilt with crisp percussion breaks and a deep low-brass finish.",
    schoolId: "ncat",
    event: "Aggie Homecoming",
    recordedAt: "2026-07-06",
    duration: "7:05",
    upvoteCount: 4856,
    imageUrl:
      "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Brass musicians performing together on stage",
    imageCredit: "Photo by Jens Thekkeveettil on Unsplash",
  },
  {
    id: "performance-4",
    slug: "human-jukebox-stands-battle",
    title: "Human Jukebox Brings the Wall of Sound",
    description:
      "Southern fills every corner of the stadium with a disciplined, full-bodied stands arrangement.",
    schoolId: "southern",
    event: "Bayou Classic",
    recordedAt: "2026-06-29",
    duration: "5:44",
    upvoteCount: 4621,
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Musicians silhouetted against colorful concert lighting",
    imageCredit: "Photo by Austin Neill on Unsplash",
  },
  {
    id: "performance-5",
    slug: "marching-wildcats-drum-feature",
    title: "Marching Wildcats Let the Drumline Cook",
    description:
      "A tight percussion feature turns into a full-band entrance with theatrical timing.",
    schoolId: "bethune",
    event: "Florida Blue Florida Classic",
    recordedAt: "2026-06-24",
    duration: "4:57",
    upvoteCount: 3984,
    imageUrl:
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A drummer performing under warm stage lighting",
    imageCredit: "Photo by Matthijs Smit on Unsplash",
  },
];

export function getSchoolById(id: string) {
  return schools.find((school) => school.id === id);
}

export function getSchoolBySlug(slug: string) {
  return schools.find((school) => school.slug === slug);
}

export function getPerformancesForSchool(schoolId: string) {
  return performances.filter((performance) => performance.schoolId === schoolId);
}
