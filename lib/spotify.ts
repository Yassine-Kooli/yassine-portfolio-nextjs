// Spotify iFrame API: https://developer.spotify.com/documentation/embeds/references/iframe-api
export type PlaybackUpdate = { playingURI: string; isPaused: boolean; isBuffering: boolean; duration: number; position: number };

export type EmbedController = {
  loadEntity?: (uriOrUrl: string, preferVideo?: boolean, startAt?: number) => void;
  /** deprecated in favour of loadEntity */
  loadUri: (uri: string, preferVideo?: boolean, startAt?: number, theme?: "dark") => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: {
    (event: "ready", cb: () => void): void;
    (event: "playback_update", cb: (e: { data: PlaybackUpdate }) => void): void;
  };
};

type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: EmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

let apiPromise: Promise<IFrameAPI> | null = null;

export function loadSpotifyApi() {
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error("Spotify embed failed to load"));
      };
      document.body.appendChild(script);
    });
  }
  return apiPromise;
}

// The live controller exists only while the Music window is mounted.
let controller: EmbedController | null = null;
export const setController = (c: EmbedController | null) => {
  controller = c;
};
export const getController = () => controller;
