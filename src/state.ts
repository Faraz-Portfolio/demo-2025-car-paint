import { create } from "zustand";

export const COLORS = [
  {
    color: "red",
    flake: "silver",
    perl: "red",
  },
  {
    color: "black",
    flake: "silver",
    perl: "silver",
  },
  {
    color: "#004225",
    flake: "#199861",
    perl: "#01632a",
  },
  {
    color: "#F8CD02",
    flake: "#fae20c",
    perl: "#ffc400",
  },
  {
    color: "#9a02f8",
    flake: "#edcfff",
    perl: "#e088f9",
  },
  {
    color: "#ffffff",
    flake: "#eeffff",
    perl: "#eeffff",
  },
  {
    color: "#7acaff",
    flake: "#ffffff",
    perl: "#013455",
  },
  {
    color: "#ff61bd",
    flake: "#ffbde3",
    perl: "#ffbde3",
  },
];

export const CAMERAS = ["Side", "Closeup", "Front", "Top", "Rear "];

interface AppState {
  colorIndex: number;
  currentCamera: number;
}

export const useApp = create<AppState>(() => ({
  colorIndex: 0,
  currentCamera: 0,
}));
