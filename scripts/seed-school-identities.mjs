import { readFile } from "node:fs/promises";
import postgres from "postgres";

const IDENTITY_FILES = [1, 2, 3, 4, 5].map(
  (part) => new URL(`./data/school-identities-${part}.json`, import.meta.url),
);

function validateIdentity(identity, file) {
  const requiredStrings = [
    "slug",
    "abbreviation",
    "conference",
    "primaryColor",
    "secondaryColor",
  ];

  for (const field of requiredStrings) {
    if (typeof identity[field] !== "string" || !identity[field].trim()) {
      throw new Error(`${file}: ${identity.slug ?? "unknown"} has no ${field}.`);
    }
  }

  if (identity.abbreviation.length > 16) {
    throw new Error(`${identity.slug}: abbreviation exceeds 16 characters.`);
  }
  if (identity.conference.length > 80) {
    throw new Error(`${identity.slug}: conference exceeds 80 characters.`);
  }

  for (const field of ["primaryColor", "secondaryColor"]) {
    if (!/^#[0-9a-f]{6}$/i.test(identity[field])) {
      throw new Error(`${identity.slug}: ${field} must be a six-digit hex color.`);
    }
  }

  if (
    !Array.isArray(identity.sources) ||
    identity.sources.length === 0 ||
    identity.sources.some((source) => typeof source !== "string")
  ) {
    throw new Error(`${identity.slug}: at least one source URL is required.`);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const identities = [];
  for (const file of IDENTITY_FILES) {
    const records = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(records)) {
      throw new Error(`${file.pathname} must contain a JSON array.`);
    }

    for (const identity of records) {
      validateIdentity(identity, file.pathname);
      identities.push(identity);
    }
  }

  const duplicateSlugs = identities
    .map((identity) => identity.slug)
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);
  if (duplicateSlugs.length > 0) {
    throw new Error(`Duplicate identity slugs: ${duplicateSlugs.join(", ")}`);
  }

  const sql = postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
  });

  try {
    const schools = await sql`select slug from public.schools order by slug`;
    const databaseSlugs = new Set(schools.map((school) => school.slug));
    const identitySlugs = new Set(identities.map((identity) => identity.slug));
    const missing = schools
      .map((school) => school.slug)
      .filter((slug) => !identitySlugs.has(slug));
    const unknown = identities
      .map((identity) => identity.slug)
      .filter((slug) => !databaseSlugs.has(slug));

    if (missing.length > 0 || unknown.length > 0) {
      throw new Error(
        [
          missing.length > 0
            ? `Missing school identities: ${missing.join(", ")}`
            : null,
          unknown.length > 0 ? `Unknown school identities: ${unknown.join(", ")}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }

    await sql.begin(async (transaction) => {
      for (const identity of identities) {
        await transaction`
          update public.schools
          set
            abbreviation = ${identity.abbreviation},
            conference = ${identity.conference},
            primary_color = ${identity.primaryColor.toUpperCase()},
            secondary_color = ${identity.secondaryColor.toUpperCase()},
            data_verified_at = now(),
            updated_at = now()
          where slug = ${identity.slug}
        `;
      }
    });

    console.log(`Updated identity metadata for ${identities.length} HBCUs.`);
  } finally {
    await sql.end();
  }
}

await main();
