export const sections = ["Opeth", "Prog Metal"] as const;
export type Section = (typeof sections)[number];

export type Track = {
  title: string;
  artist: string;
  album: string;
  section: Section;
  /**
   * The ID from a Spotify track link: open.spotify.com/track/<id>.
   * Copy it from the album page so you get the studio cut, not a live/remix version.
   */
  spotifyId: string;
  /** Album art. Grab it from https://open.spotify.com/oembed?url=<track link> (thumbnail_url). */
  cover?: string;
};

export const playlist: Track[] = [
  // ── Opeth ──
  { title: "Windowpane", artist: "Opeth", album: "Damnation", section: "Opeth", spotifyId: "4uJSCrI7r0usNJ3aaHAuC6", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02cf5507e5a84e6332c910b0d5" },
  { title: "In My Time of Need", artist: "Opeth", album: "Damnation", section: "Opeth", spotifyId: "3WtsQAngIkmcNeqVeK3fXQ", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02cf5507e5a84e6332c910b0d5" },
  { title: "Death Whispered a Lullaby", artist: "Opeth", album: "Damnation", section: "Opeth", spotifyId: "61Hd6XNqSpreYVEiMkaHvq", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02cf5507e5a84e6332c910b0d5" },
  { title: "The Leper Affinity", artist: "Opeth", album: "Blackwater Park", section: "Opeth", spotifyId: "0e8n9fFFFSa9zMzLnzQpPv", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0213d0ed017d3ad35ed6bd1e90" },
  { title: "Bleak", artist: "Opeth", album: "Blackwater Park", section: "Opeth", spotifyId: "0Nj4eoThAEPpmeSA6zWYEs", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0213d0ed017d3ad35ed6bd1e90" },
  { title: "Harvest", artist: "Opeth", album: "Blackwater Park", section: "Opeth", spotifyId: "0fBPwRmfNmOdpNcxOoli9Q", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0213d0ed017d3ad35ed6bd1e90" },
  { title: "The Drapery Falls", artist: "Opeth", album: "Blackwater Park", section: "Opeth", spotifyId: "3OhcMJk4hCebfDH1h4Z8mX", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0213d0ed017d3ad35ed6bd1e90" },
  { title: "Ghost of Perdition", artist: "Opeth", album: "Ghost Reveries", section: "Opeth", spotifyId: "0ppdt8zRZOHIKh4ZDB0Zp9", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021451fa8ef96932abd5a81791" },
  { title: "The Baying of the Hounds", artist: "Opeth", album: "Ghost Reveries", section: "Opeth", spotifyId: "4JIfgJkxaWu9I2gdNR3wi5", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021451fa8ef96932abd5a81791" },
  { title: "Hours of Wealth", artist: "Opeth", album: "Ghost Reveries", section: "Opeth", spotifyId: "1fd8YbOoVAU8KK5ONDOqs9", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021451fa8ef96932abd5a81791" },
  { title: "The Moor", artist: "Opeth", album: "Still Life", section: "Opeth", spotifyId: "6w2h8W37hSwkscVOnFQIRn", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0210e18a62d21a1c4eb15bccd4" },
  { title: "Face Of Melinda", artist: "Opeth", album: "Still Life", section: "Opeth", spotifyId: "12YKeAO7PFdre6DcABG0XW", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0210e18a62d21a1c4eb15bccd4" },
  { title: "Deliverance", artist: "Opeth", album: "Deliverance", section: "Opeth", spotifyId: "4siXNiLG9VJR6Z2kP6fFjv", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f6339451fdf4b62bfdc2d54b" },
  { title: "A Fair Judgement", artist: "Opeth", album: "Deliverance", section: "Opeth", spotifyId: "0UREf6fp0r3upWFmLDzHFp", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f6339451fdf4b62bfdc2d54b" },
  { title: "Burden", artist: "Opeth", album: "Watershed", section: "Opeth", spotifyId: "7EqkvBTdhYPTd91mN2DmcA", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e43bd4878a9915fad4587e63" },
  { title: "Porcelain Heart", artist: "Opeth", album: "Watershed", section: "Opeth", spotifyId: "1yEvXdpXjyDclX2yH13hE7", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e43bd4878a9915fad4587e63" },
  { title: "Hessian Peel", artist: "Opeth", album: "Watershed", section: "Opeth", spotifyId: "38KkuEgkcdrxOIbqijawtU", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e43bd4878a9915fad4587e63" },
  { title: "Demon Of The Fall", artist: "Opeth", album: "My Arms, Your Hearse", section: "Opeth", spotifyId: "7FUHuwk7WyemN8Od6Oupmk", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0242db54d048b472bef1499794" },
  { title: "Folklore", artist: "Opeth", album: "Heritage", section: "Opeth", spotifyId: "0KejVTKg5EeUK7vpUcIjmd", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ed50c4654934dbbd545b742b" },
  { title: "Cusp of Eternity", artist: "Opeth", album: "Pale Communion", section: "Opeth", spotifyId: "4pmqtt1M0hGwdyJocXyV1a", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024fda697ad1d3866d9418dcb1" },
  { title: "Faith in Others", artist: "Opeth", album: "Pale Communion", section: "Opeth", spotifyId: "12bVZuuIZS6jVv6jobbOH1", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024fda697ad1d3866d9418dcb1" },
  { title: "Sorceress", artist: "Opeth", album: "Sorceress", section: "Opeth", spotifyId: "6nRNQYHQtou2Z9FdeLRxYA", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02436d89a527e01f20f0d89fca" },
  { title: "Will O The Wisp", artist: "Opeth", album: "Sorceress", section: "Opeth", spotifyId: "1lk9SDtA4DTgp2L4h8KLsi", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02436d89a527e01f20f0d89fca" },
  { title: "Heart in Hand", artist: "Opeth", album: "In Cauda Venenum", section: "Opeth", spotifyId: "291oFHIYUq3EIoCQ4AMii5", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0297cfe29ded7e55ba0d390a94" },
  { title: "All Things Will Pass", artist: "Opeth", album: "In Cauda Venenum", section: "Opeth", spotifyId: "138mYB8KfyCLDmp76vIZkJ", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0297cfe29ded7e55ba0d390a94" },
  // ── Prog Metal ──
  { title: "Pull Me Under", artist: "Dream Theater", album: "Images and Words", section: "Prog Metal", spotifyId: "5CPXR6lDTvngxtmMZxnWmC", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02731bb7df1b9d71fa61451659" },
  { title: "Metropolis - Part I: \"The Miracle and the Sleeper\"", artist: "Dream Theater", album: "Images and Words", section: "Prog Metal", spotifyId: "6nRCTb5b0N5zp8WTeY6xFZ", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02731bb7df1b9d71fa61451659" },
  { title: "Schism", artist: "Tool", album: "Lateralus", section: "Prog Metal", spotifyId: "55mJleti2WfWEFNFcBduhc", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022949ed4e8581d3a1f20cd0e0" },
  { title: "Parabola", artist: "Tool", album: "Lateralus", section: "Prog Metal", spotifyId: "1vxu8vMNshg5J8z3oA7QJZ", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022949ed4e8581d3a1f20cd0e0" },
  { title: "Lateralus", artist: "Tool", album: "Lateralus", section: "Prog Metal", spotifyId: "7tvuLLroI0n6uYBWuFig5d", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022949ed4e8581d3a1f20cd0e0" },
  { title: "Trains", artist: "Porcupine Tree", album: "In Absentia", section: "Prog Metal", spotifyId: "6BSMFkjxpazoEj0hJG5trT", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025e3e7d276f8263ffa43124b5" },
  { title: "Blackest Eyes", artist: "Porcupine Tree", album: "In Absentia", section: "Prog Metal", spotifyId: "2Gl8sH6spK27nQ900wTGCb", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025e3e7d276f8263ffa43124b5" },
  { title: "Flying Whales", artist: "Gojira", album: "From Mars to Sirius", section: "Prog Metal", spotifyId: "6SJ2LK3yMdGzC4AEcXJZo4", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0225cb68126955c4d8d8c95dec" },
  { title: "Ocean Planet", artist: "Gojira", album: "From Mars to Sirius", section: "Prog Metal", spotifyId: "1ZNlVOjJrqkrgsEWd8jrGd", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0225cb68126955c4d8d8c95dec" },
  { title: "The Price", artist: "Leprous", album: "The Congregation", section: "Prog Metal", spotifyId: "1zhslrTnZTCu5yHw8MjUF7", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0267b392d2a2ae23b3c32830fa" },
  { title: "Cockroach King", artist: "Haken", album: "The Mountain", section: "Prog Metal", spotifyId: "6aX43qjxz4ejCiIG15m5MY", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ab84ed6108b8e66d39f76fd8" },
  { title: "In the Shadow of Our Pale Companion", artist: "Agalloch", album: "The Mantle", section: "Prog Metal", spotifyId: "1wJ5Z1Nkcqknyi2U2mjL0G", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028643b1779936c3dc7de03c65" },
  { title: "Oblivion", artist: "Mastodon", album: "Crack the Skye", section: "Prog Metal", spotifyId: "4Ynr1SPCeUI0W0YPeSFSIK", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ac79283ccb6d08af31fd33d8" },
  { title: "The Czar: Usurper / Escape / Martyr / Spiral", artist: "Mastodon", album: "Crack the Skye", section: "Prog Metal", spotifyId: "2LMjQnKH7sQzOD0l8q6eWz", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ac79283ccb6d08af31fd33d8" },
  { title: "My Twin", artist: "Katatonia", album: "The Great Cold Distance", section: "Prog Metal", spotifyId: "4nOLhdUgfpGENcLDqFPfey", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0215d3f8311f1e4d550a239200" },
  { title: "July", artist: "Katatonia", album: "The Great Cold Distance", section: "Prog Metal", spotifyId: "3AIfiiwhkQhUWLXQU3BZlK", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0215d3f8311f1e4d550a239200" },
];

export const trackUri = (t: Track) => `spotify:track:${t.spotifyId}`;
