import postgres from "postgres";

const DIRECTORY_URL =
  "https://sites.ed.gov/whhbcu/one-hundred-and-five-historically-black-colleges-and-universities/";
const SCORECARD_URL =
  "https://api.data.gov/ed/collegescorecard/v1/schools";

const BAND_PROGRAMS = {
  "bethune-cookman": {
    bandName: "Marching Wildcats",
    sourceUrl: "https://www.cookman.edu/bcu-band/",
  },
  "central-state-university": {
    bandName: "Invincible Marching Marauders",
    sourceUrl:
      "https://www.centralstate.edu/student-services-get-involved/invincible-marching-marauders",
  },
  "cheyney-university-of-pennsylvania": {
    bandName: "Soulful Sound",
    sourceUrl: "https://cheyney.edu/band/",
  },
  "coahoma-community-college": {
    bandName: "Marching Maroon Typhoon",
    sourceUrl: "https://www.coahomacc.edu/news/Spring2025/MardiGras25.html",
  },
  "fisk-university": {
    bandName: "Music City Sound",
    sourceUrl:
      "https://www.fisk.edu/academics/school-of-humanities-social-sciences/music-major/fisk-university-marching-band/",
  },
  "florida-a-and-m": {
    bandName: "The Marching 100",
    sourceUrl: "https://www.famu.edu/administration/campus-services/marching-100/",
  },
  "florida-memorial-university": {
    bandName: "The ROAR",
    sourceUrl:
      "https://fmuniv.edu/student-engagement/clubs-and-organizations",
  },
  "hampton-university": {
    bandName: "The Marching FORCE",
    sourceUrl:
      "https://home.hamptonu.edu/blog/2025/12/01/from-hampton-roads-to-the-rose-parade-the-marching-force-blooms-on-a-national-stage/",
  },
  "hinds-community-college-utica": {
    bandName: "Eagle Marching Band",
    sourceUrl:
      "https://www.hindscc.edu/pathways/arts-humanities/performing-arts/music/band/eagle-marching-band",
  },
  "jackson-state": {
    bandName: "Sonic Boom of the South",
    sourceUrl: "https://sites.jsums.edu/sonicboom/",
  },
  "jarvis-christian-college": {
    bandName: "The Sophisticated Sound of Soul",
    sourceUrl: "https://www.jarvis.edu/students-affairs/band/",
  },
  "kentucky-state-university": {
    bandName: "Mighty Marching Thorobreds",
    sourceUrl:
      "https://www.kysu.edu/academics/college-as/school-of-humanities/music-performing-ensembles-bands-marching-band.php",
  },
  "langston-university": {
    bandName: "Marching Pride Band",
    sourceUrl: "https://langston.edu/department-of-music/marching-pride/",
  },
  "lincoln-university": {
    bandName: "“ORANGE CRUSH” Roaring Lion Marching Band",
    sourceUrl:
      "https://www.lincoln.edu/student-life/clubs-and-organizations/university-bands/index.html",
  },
  "lincoln-university-missouri": {
    bandName: "Marching Musical Storm",
    sourceUrl:
      "https://www.lincolnu.edu/student-life/get-involved/band/index.html",
  },
  "north-carolina-a-and-t": {
    bandName: "Blue & Gold Marching Machine",
    sourceUrl:
      "https://www.ncat.edu/campus-life/student-affairs/departments/blue-and-gold-marching-machine/index.php",
  },
  "simmons-college-of-kentucky": {
    bandName: "Simmons Marching Falcons",
    sourceUrl: "https://simmonscollegeky.edu/band/",
  },
  "southern-university-at-shreveport": {
    bandName: "The Marching Jags Marching Band",
    sourceUrl: "https://www.susla.edu/page/band",
  },
  "southern-university": {
    bandName: "Human Jukebox",
    sourceUrl: "https://www.subr.edu/page/human-jukebox",
  },
  "stillman-college": {
    bandName: "World Class Blue Pride Marching Tigers",
    sourceUrl: "https://stillman.edu/student-life/clubs-organizations/",
  },
  "talladega-college": {
    bandName: "Great Tornado Band",
    sourceUrl:
      "https://www.talladega.edu/news/diverse-student-interests-make-a-well-rounded-incoming-class/",
  },
  "tennessee-state": {
    bandName: "Aristocrat of Bands",
    sourceUrl: "https://www.tnstate.edu/music/aristocrats.aspx",
  },
  "west-virginia-state-university": {
    bandName: "Marching Swarm",
    sourceUrl: "https://give.wvstateu.edu/project/28838",
  },
  "wilberforce-university": {
    bandName: "Hounds of Sound",
    sourceUrl:
      "https://wilberforce.edu/the-sound-of-legacy-wilberforce-universitys-music-program-inspires-a-new-generation/",
  },
  "wiley-college": {
    bandName: "The Marching Grandioso",
    sourceUrl:
      "https://www.wileyc.edu/news/wiley-university-announces-mr-marques-d-graham-as-the-new-director-of-band-programs",
  },
  "xavier-university-of-louisiana": {
    bandName: "Golden Sound Marching Band",
    sourceUrl:
      "https://www.xula.edu/news/2023/01/the-beat-goes-on-with-the-golden-sound-marching-band.html",
  },
};

const SLUG_ALIASES = {
  "bethune-cookman-university": "bethune-cookman",
  "florida-agricultural-and-mechanical-university": "florida-a-and-m",
  "jackson-state-university": "jackson-state",
  "jarvis-christian-university": "jarvis-christian-college",
  "north-carolina-a-t-state-university": "north-carolina-a-and-t",
  "philander-smith-university": "philander-smith-college",
  "southern-university-and-a-m-college": "southern-university",
  "tennessee-state-university": "tennessee-state",
  "bluefield-state-university": "bluefield-state-college",
  "edward-waters-university": "edward-waters-college",
  "voorhees-university": "voorhees-college",
  "wiley-university": "wiley-college",
};

const STATE_CODES = {
  Alabama: "AL",
  Arkansas: "AR",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Kentucky: "KY",
  Louisiana: "LA",
  Maryland: "MD",
  Mississippi: "MS",
  Missouri: "MO",
  "North Carolina": "NC",
  Ohio: "OH",
  Oklahoma: "OK",
  Pennsylvania: "PA",
  "South Carolina": "SC",
  Tennessee: "TN",
  Texas: "TX",
  Virginia: "VA",
  "Virgin Islands": "VI",
  "West Virginia": "WV",
};

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function locationFromAddress(address) {
  for (const [stateName, state] of Object.entries(STATE_CODES)) {
    const marker = `, ${stateName} `;
    const stateIndex = address.lastIndexOf(marker);
    if (stateIndex === -1) continue;

    const beforeState = address.slice(0, stateIndex);
    const city = beforeState.slice(beforeState.lastIndexOf(",") + 1).trim();
    return { city, state };
  }

  return { city: null, state: null };
}

function parseDirectory(html) {
  const table = html.match(
    /<table[^>]*width=["']?95%["']?[^>]*>([\s\S]*?)<\/table>/i,
  )?.[1];
  if (!table) throw new Error("The official HBCU directory table was not found.");

  const schools = [];
  for (const row of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(
      (match) => match[1],
    );
    if (cells.length !== 4) continue;

    const name = decodeHtml(cells[0]);
    if (!name || name === "Name") continue;

    const address = decodeHtml(cells[1]);
    const href = cells[2].match(/href=["']([^"']+)["']/i)?.[1] ?? null;
    const websiteUrl = href
      ? decodeHtml(href).replace(/^http:\/\//, "https://")
      : null;
    const institutionType = decodeHtml(cells[3]);
    const officialSlug = slugify(name);
    const slug = SLUG_ALIASES[officialSlug] ?? officialSlug;
    const band = BAND_PROGRAMS[slug];
    const { city, state } = locationFromAddress(address);

    schools.push({
      name,
      slug,
      bandName: band?.bandName ?? null,
      bandSourceUrl: band?.sourceUrl ?? null,
      hasMarchingBand: Boolean(band),
      websiteUrl,
      institutionType,
      address,
      city,
      state,
    });
  }

  return schools;
}

async function fetchScorecardSchools() {
  const results = [];

  for (let page = 0; page < 2; page += 1) {
    const url = new URL(SCORECARD_URL);
    url.searchParams.set("api_key", "DEMO_KEY");
    url.searchParams.set("school.minority_serving.historically_black", "1");
    url.searchParams.set(
      "fields",
      "id,school.name,school.city,school.state,school.school_url",
    );
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`College Scorecard returned ${response.status}.`);
    }

    const payload = await response.json();
    results.push(...payload.results);
    if (results.length >= payload.metadata.total) break;
  }

  return results.map((record) => {
    const name = record["school.name"];
    const state = record["school.state"];
    const rawSlug = slugify(name);
    const slug =
      rawSlug === "lincoln-university" && state === "MO"
        ? "lincoln-university-missouri"
        : (SLUG_ALIASES[rawSlug] ?? rawSlug);
    const band = BAND_PROGRAMS[slug];
    const rawWebsite = record["school.school_url"];
    const websiteUrl = rawWebsite
      ? `${/^https?:\/\//.test(rawWebsite) ? "" : "https://"}${rawWebsite}`
      : null;

    return {
      scorecardId: record.id,
      name,
      slug,
      city: record["school.city"] ?? null,
      state: state ?? null,
      websiteUrl,
      bandName: band?.bandName ?? null,
      bandSourceUrl: band?.sourceUrl ?? null,
      hasMarchingBand: Boolean(band),
    };
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const [directoryResponse, scorecardSchools] = await Promise.all([
    fetch(DIRECTORY_URL),
    fetchScorecardSchools(),
  ]);
  if (!directoryResponse.ok) {
    throw new Error(
      `Official HBCU directory returned ${directoryResponse.status}.`,
    );
  }

  const schools = parseDirectory(await directoryResponse.text());
  if (schools.length < 100) {
    throw new Error(`Expected at least 100 HBCUs, parsed ${schools.length}.`);
  }
  if (scorecardSchools.length < 100) {
    throw new Error(
      `Expected at least 100 Scorecard HBCUs, parsed ${scorecardSchools.length}.`,
    );
  }

  const sql = postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
  });

  await sql.begin(async (transaction) => {
    for (const school of schools) {
      await transaction`
        insert into public.schools (
          name,
          slug,
          band_name,
          website_url,
          institution_type,
          address,
          city,
          state,
          location,
          has_marching_band,
          band_source_url,
          directory_source_url,
          data_verified_at
        )
        values (
          ${school.name},
          ${school.slug},
          ${school.bandName},
          ${school.websiteUrl},
          ${school.institutionType},
          ${school.address},
          ${school.city},
          ${school.state},
          ${school.city && school.state ? `${school.city}, ${school.state}` : null},
          ${school.hasMarchingBand},
          ${school.bandSourceUrl},
          ${DIRECTORY_URL},
          now()
        )
        on conflict (slug) do update set
          name = excluded.name,
          band_name = coalesce(excluded.band_name, public.schools.band_name),
          website_url = excluded.website_url,
          institution_type = excluded.institution_type,
          address = excluded.address,
          city = excluded.city,
          state = excluded.state,
          location = excluded.location,
          has_marching_band =
            excluded.has_marching_band or public.schools.has_marching_band,
          band_source_url = coalesce(
            excluded.band_source_url,
            public.schools.band_source_url
          ),
          directory_source_url = excluded.directory_source_url,
          data_verified_at = excluded.data_verified_at,
          updated_at = now()
      `;
    }

    for (const school of scorecardSchools) {
      await transaction`
        insert into public.schools (
          scorecard_id,
          name,
          slug,
          band_name,
          website_url,
          city,
          state,
          location,
          has_marching_band,
          band_source_url,
          directory_source_url,
          data_verified_at
        )
        values (
          ${school.scorecardId},
          ${school.name},
          ${school.slug},
          ${school.bandName},
          ${school.websiteUrl},
          ${school.city},
          ${school.state},
          ${school.city && school.state ? `${school.city}, ${school.state}` : null},
          ${school.hasMarchingBand},
          ${school.bandSourceUrl},
          ${"https://collegescorecard.ed.gov/data/api/"},
          now()
        )
        on conflict (slug) do update set
          scorecard_id = excluded.scorecard_id,
          name = excluded.name,
          band_name = coalesce(excluded.band_name, public.schools.band_name),
          website_url = coalesce(
            excluded.website_url,
            public.schools.website_url
          ),
          city = excluded.city,
          state = excluded.state,
          location = excluded.location,
          has_marching_band =
            excluded.has_marching_band or public.schools.has_marching_band,
          band_source_url = coalesce(
            excluded.band_source_url,
            public.schools.band_source_url
          ),
          directory_source_url = excluded.directory_source_url,
          data_verified_at = excluded.data_verified_at,
          updated_at = now()
      `;
    }
  });

  const [{ total, bands }] = await sql`
    select
      count(*)::int as total,
      count(*) filter (where has_marching_band)::int as bands
    from public.schools
  `;

  console.log(`Seeded ${total} HBCUs, including ${bands} verified band programs.`);
  await sql.end();
}

await main();
