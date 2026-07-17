import {
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
    abbreviation: varchar("abbreviation", { length: 16 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    bandName: varchar("band_name", { length: 180 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 180 }),
    conference: varchar("conference", { length: 32 }),
    logoUrl: text("logo_url"),
    primaryColor: varchar("primary_color", { length: 32 }).notNull(),
    secondaryColor: varchar("secondary_color", { length: 32 }),
    totalScore: integer("total_score").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("schools_name_unique").on(table.name),
    uniqueIndex("schools_slug_unique").on(table.slug),
    index("schools_total_score_idx").on(table.totalScore),
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
