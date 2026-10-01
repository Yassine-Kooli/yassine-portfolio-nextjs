import { create } from "zustand";
import { playlist, trackUri } from "@/lib/playlist";
import { getController } from "@/lib/spotify";

// pause()/resume() are occasionally ignored by the embed; togglePlay() is the
// fallback if the reported state hasn't flipped shortly after.
function ensureState(wantPlaying: boolean) {
  setTimeout(() => {
    if (useMusic.getState().playing !== wantPlaying) getController()?.togglePlay();
  }, 900);
}

type MusicStore = {
  index: number;
  /** Actual playback state, reported by the Spotify embed */
  playing: boolean;
  /** Playback was requested but hasn't started yet (embed loading, or window not open yet) */
  wantPlay: boolean;
  time: number;
  duration: number;
  ready: boolean;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  play: (index?: number) => void;
  pause: () => void;
  toggle: () => void;
  next: (auto?: boolean) => void;
  prev: () => void;
  seek: (seconds: number) => void;
  set: (patch: Partial<Pick<MusicStore, "playing" | "wantPlay" | "time" | "duration" | "ready" | "shuffle" | "repeat">>) => void;
};

export const useMusic = create<MusicStore>((set, get) => ({
  index: 0,
  playing: false,
  wantPlay: false,
  time: 0,
  duration: 0,
  ready: false,
  shuffle: false,
  repeat: "all",

  play: (index) => {
    if (!playlist.length) return;
    const ctl = getController();
    const changed = index !== undefined && index !== get().index;
    if (changed) set({ index, time: 0, duration: 0 });
    set({ wantPlay: true });
    if (!ctl || !get().ready) return; // the Music window picks wantPlay up once ready
    if (changed) {
      const uri = trackUri(playlist[get().index]);
      if (ctl.loadEntity) ctl.loadEntity(uri);
      else ctl.loadUri(uri, false, 0, "dark");
      // The embed gives no "loaded" signal for new content, so retry until it plays.
      // A playback_update with isPaused=false clears wantPlay and stops the retries.
      [600, 1500, 3000].forEach((ms) =>
        setTimeout(() => {
          if (get().wantPlay && !get().playing) getController()?.play();
        }, ms),
      );
    } else {
      ctl.resume();
      ensureState(true);
    }
  },
  pause: () => {
    set({ wantPlay: false });
    const ctl = getController();
    if (!ctl) return;
    ctl.pause();
    ensureState(false);
  },
  toggle: () => (get().playing ? get().pause() : get().play()),
  next: (auto = false) => {
    const { index, shuffle, repeat } = get();
    const n = playlist.length;
    if (!n) return;
    if (auto && repeat === "one") {
      get().seek(0);
      return getController()?.resume();
    }
    if (auto && repeat === "off" && !shuffle && index === n - 1) return;
    let target = (index + 1) % n;
    if (shuffle && n > 1) {
      do target = Math.floor(Math.random() * n);
      while (target === index);
    }
    get().play(target);
  },
  prev: () => {
    const { index, time } = get();
    if (time > 3) return get().seek(0);
    get().play((index - 1 + playlist.length) % playlist.length);
  },
  seek: (seconds) => getController()?.seek(seconds),
  set: (patch) => set(patch),
}));
