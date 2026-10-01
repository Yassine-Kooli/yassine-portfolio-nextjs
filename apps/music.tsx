"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { LuPause, LuPlay, LuRepeat, LuRepeat1, LuSearch, LuShuffle, LuSkipBack, LuSkipForward } from "react-icons/lu";
import { playlist, sections, trackUri, type Track } from "@/lib/playlist";
import { loadSpotifyApi, setController } from "@/lib/spotify";
import { useMusic } from "@/store/music";

function Cover({ track, size }: { track?: Track; size: number }) {
  if (track?.cover) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={track.cover} alt="" width={size} height={size} className="shrink-0 rounded-lg object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0 rounded-lg">
      <rect width="100" height="100" fill="#1a1414" />
      <circle cx="50" cy="30" r="10" fill="#d9d1c1" opacity=".8" />
      <path d="M0 100 L0 70 L8 52 L14 70 L20 46 L28 70 L36 56 L44 70 L52 40 L60 70 L68 54 L76 70 L84 48 L92 70 L100 58 L100 100Z" fill="#050505" />
    </svg>
  );
}

/** Mounts the Spotify embed and wires its events into the music store. */
function useSpotifyEmbed(hostRef: React.RefObject<HTMLDivElement>) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let destroy: (() => void) | null = null;
    // Give Spotify its own node: it replaces it with an iframe, which React must not own.
    const mount = document.createElement("div");
    host.appendChild(mount);

    loadSpotifyApi()
      .then((api) => {
        if (cancelled) return;
        const { index } = useMusic.getState();
        api.createController(mount, { uri: trackUri(playlist[index]), width: "100%", height: 152 }, (ctl) => {
          if (cancelled) return ctl.destroy();
          setController(ctl);
          destroy = () => ctl.destroy();

          // The embed sometimes starts playing by itself shortly after loading
          // (e.g. when the browser is logged in to Spotify). Opening the window
          // shouldn't blast music, so pause unrequested playback in that window.
          let guardUntil = 0;

          ctl.addListener("ready", () => {
            const s = useMusic.getState();
            s.set({ ready: true });
            if (s.wantPlay) ctl.play();
            else guardUntil = Date.now() + 5000;
          });

          let lastPos = 0;
          ctl.addListener("playback_update", ({ data }) => {
            const s = useMusic.getState();
            if (!data.isPaused && !s.wantPlay && Date.now() < guardUntil) {
              guardUntil = 0;
              return ctl.pause();
            }
            const wasPlaying = s.playing;
            s.set({ playing: !data.isPaused, time: data.position / 1000, duration: data.duration / 1000 });
            if (!data.isPaused) s.set({ wantPlay: false });
            // Track finished: playback stopped right at the end
            const pos = Math.max(lastPos, data.position);
            if (wasPlaying && data.isPaused && data.duration > 0 && pos >= data.duration - 1500) s.next(true);
            lastPos = data.isPaused ? 0 : data.position;
          });
        });
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      destroy?.();
      setController(null);
      useMusic.getState().set({ ready: false, playing: false, wantPlay: false });
      host.innerHTML = "";
    };
  }, [hostRef]);

  return failed;
}

export default function Music() {
  const { index, playing, ready, shuffle, repeat, play, toggle, next, prev, set } = useMusic();
  const hostRef = useRef<HTMLDivElement>(null);
  const failed = useSpotifyEmbed(hostRef);
  const track = playlist[index];
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = (t: Track) => !q || [t.title, t.artist, t.album].some((f) => f.toLowerCase().includes(q));

  // Keep the current track in view when it changes (e.g. `next` from the terminal)
  useEffect(() => {
    document.getElementById(`track-${playlist[index]?.spotifyId}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [index]);

  if (!playlist.length) {
    return (
      <div className="grid h-full place-items-center bg-crypt p-8 text-center text-ash-400">
        <p>
          The playlist is empty. Add Spotify tracks to <code className="text-accent">lib/playlist.ts</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-crypt text-bone sm:flex-row sm:overflow-hidden">
      <div className="flex shrink-0 flex-col items-center gap-3 border-b border-black/60 bg-gradient-to-b from-[#1a0808] to-crypt p-5 sm:w-[320px] sm:overflow-y-auto sm:border-b-0 sm:border-r">
        <div className={clsx("rounded-lg shadow-[0_20px_50px_rgba(0,0,0,.8)] transition", playing && "shadow-[0_20px_60px_rgb(var(--accent)/.4)]")}>
          <Cover track={track} size={150} />
        </div>
        <div className="w-full text-center">
          <div className="truncate font-display text-lg font-semibold tracking-wide text-parchment">{track.title}</div>
          <div className="truncate text-sm text-ash-400">
            {track.artist} · {track.album}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IconBtn label="Shuffle" active={shuffle} onClick={() => set({ shuffle: !shuffle })}>
            <LuShuffle size={16} />
          </IconBtn>
          <IconBtn label="Previous" onClick={prev}>
            <LuSkipBack size={20} />
          </IconBtn>
          <button
            onClick={toggle}
            disabled={!ready}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-12 w-12 place-items-center rounded-full bg-accent text-parchment shadow-[0_0_30px_rgb(var(--accent)/.5)] transition hover:scale-105 disabled:opacity-40"
          >
            {playing ? <LuPause size={22} /> : <LuPlay size={22} className="translate-x-0.5" />}
          </button>
          <IconBtn label="Next" onClick={() => next()}>
            <LuSkipForward size={20} />
          </IconBtn>
          <IconBtn label="Repeat" active={repeat !== "off"} onClick={() => set({ repeat: repeat === "off" ? "all" : repeat === "all" ? "one" : "off" })}>
            {repeat === "one" ? <LuRepeat1 size={16} /> : <LuRepeat size={16} />}
          </IconBtn>
        </div>

        {/* Spotify's own player: required to stay visible by Spotify's embed terms */}
        <div className="relative h-[152px] w-full shrink-0 overflow-hidden rounded-xl bg-black/40">
          <div ref={hostRef} className="h-full w-full" />
          {!ready && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-ash-500">
              {failed ? "Spotify couldn't load (blocked by an extension?)" : "Summoning Spotify…"}
            </div>
          )}
        </div>
        <p className="text-center text-[11px] leading-snug text-ash-500">Log in to Spotify in this browser for full tracks — otherwise you hear 30s previews.</p>
      </div>

      <div className="min-h-0 flex-1 p-3 sm:overflow-y-auto">
        <label className="sticky top-0 z-10 mb-2 flex items-center gap-2 rounded-lg border border-white/5 bg-ash-900/95 px-3 py-2 text-sm backdrop-blur">
          <LuSearch size={14} className="text-ash-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${playlist.length} tracks…`}
            className="w-full bg-transparent text-bone outline-none placeholder:text-ash-600"
          />
        </label>
        {sections.map((section) => {
          const rows = playlist.map((t, i) => ({ t, i })).filter(({ t }) => t.section === section && matches(t));
          if (!rows.length) return null;
          return (
            <section key={section} className="mb-3">
              <h3 className="px-3 pb-2 pt-1 font-display text-xs tracking-[0.25em] text-ash-500">
                {section.toUpperCase()} <span className="text-ash-600">· {rows.length}</span>
              </h3>
              {rows.map(({ t, i }) => (
                <button
                  key={t.spotifyId}
                  id={`track-${t.spotifyId}`}
                  onClick={() => play(i)}
                  className={clsx("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5", i === index && "bg-accent/15")}
                >
                  <span className="w-5 text-right text-xs tabular-nums text-ash-500">{i === index && playing ? <span className="text-accent">♫</span> : i + 1}</span>
                  <Cover track={t} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className={clsx("block truncate text-sm", i === index ? "text-parchment" : "text-bone")}>{t.title}</span>
                    <span className="block truncate text-xs text-ash-500">
                      {t.artist} · {t.album}
                    </span>
                  </span>
                </button>
              ))}
            </section>
          );
        })}
        {!playlist.some(matches) && <p className="px-3 py-6 text-center text-sm text-ash-500">No song by that name echoes here.</p>}
      </div>
    </div>
  );
}

function IconBtn({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} className={clsx("rounded-full p-2 transition hover:bg-white/10", active ? "text-accent" : "text-ash-300")}>
      {children}
    </button>
  );
}
