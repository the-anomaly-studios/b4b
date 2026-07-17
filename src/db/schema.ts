import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const schools = pgTable(
  "schools",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 180 }).notNull(),
    abbreviation: varchar("abbreviation", { length: 16 }),
    slug: varchar("slug", { length: 180 }).notNull(),
    bandName: varchar("band_name", { length: 180 }),
    description: text("description"),
    location: varchar("location", { length: 180 }),
    conference: varchar("conference", { length: 32 }),
    logoUrl: text("logo_url"),
    primaryColor: varchar("primary_color", { length: 32 }),
    secondaryColor: varchar("secondary_color", { length: 32 }),
    websiteUrl: text("website_url"),
    scorecardId: integer("scorecard_id"),
    institutionType: varchar("institution_type", { length: 80 }),
    address: text("address"),
    city: varchar("city", { length: 120 }),
    state: varchar("state", { length: 2 }),
    hasMarchingBand: boolean("has_marching_band").notNull().default(false),
    bandSourceUrl: text("band_source_url"),
    directorySourceUrl: text("directory_source_url"),
    dataVerifiedAt: timestamp("data_verified_at", { withTimezone: true }),
    totalScore: integer("total_score").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("schools_name_idx").on(table.name),
    uniqueIndex("schools_slug_unique").on(table.slug),
    uniqueIndex("schools_scorecard_id_unique").on(table.scorecardId),
    index("schools_total_score_idx").on(table.totalScore),
    index("schools_state_idx").on(table.state),
    index("schools_has_marching_band_idx").on(table.hasMarchingBand),
  ],
);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    username: varchar("username", { length: 40 }).notNull(),
    avatarUrl: text("avatar_url"),
    schoolId: uuid("school_id").references(() => schools.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("profiles_username_unique").on(table.username),
    index("profiles_school_id_idx").on(table.schoolId),
  ],
);

export const videos = pgTable(
  "videos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    description: text("description"),
    muxUploadId: varchar("mux_upload_id", { length: 120 }),
    muxAssetId: varchar("mux_asset_id", { length: 120 }),
    muxPlaybackId: varchar("mux_playback_id", { length: 120 }),
    thumbnailUrl: text("thumbnail_url"),
    status: varchar("status", { length: 32 })
      .notNull()
      .default("waiting_for_upload"),
    errorMessage: text("error_message"),
    uploaderId: uuid("uploader_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "restrict" }),
    upvoteCount: integer("upvote_count").notNull().default(0),
    recordedAt: timestamp("recorded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("videos_slug_unique").on(table.slug),
    uniqueIndex("videos_mux_upload_id_unique").on(table.muxUploadId),
    uniqueIndex("videos_mux_asset_id_unique").on(table.muxAssetId),
    index("videos_school_id_idx").on(table.schoolId),
    index("videos_uploader_id_idx").on(table.uploaderId),
    index("videos_created_at_idx").on(table.createdAt),
    index("videos_upvote_count_idx").on(table.upvoteCount),
    index("videos_status_idx").on(table.status),
  ],
);

export const upvotes = pgTable(
  "upvotes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("upvotes_user_video_unique").on(table.userId, table.videoId),
    index("upvotes_video_id_idx").on(table.videoId),
  ],
);

export type School = typeof schools.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Upvote = typeof upvotes.$inferSelect;
