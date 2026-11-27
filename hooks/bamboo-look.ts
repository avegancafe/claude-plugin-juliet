import type { ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Juliet's Bamboo is bamboo.nvim's palette: `vulgaris` for dark, as Juliet themes
// every app (~/.config/Juliet/.claude/rules/theming.md), and `light` for light.
const vulgaris = {
  bg0: '#252623',
  bg1: '#2f312c',
  fg: '#f1e9d2',
  green: '#8fb573',
  red: '#e75a7c',
  coral: '#f08080',
  orange: '#ff9966',
  yellow: '#dbb651',
  bgBlue: '#68aee8',
  purple: '#aaaaff',
} as const

// Its red and orange are darkened from bamboo.nvim's (#c72a3c, #df5926), which
// are too faint to read as text on the cream page.
const light = {
  bg0: '#fafae0',
  fg: '#3a4238',
  green: '#27850b',
  red: '#b3243a',
  orange: '#b8481c',
  yellow: '#a77b00',
  blue: '#1745d5',
  purple: '#8a4adf',
} as const

// Juliet's own additions to it: the brighter green its pi theme marks success
// with, and the cream paper and moss of its Noctalia light palette.
const juliet = {
  greenBright: '#70be71',
  paper: '#f1e9d2',
  ink: '#1c1e1b',
  moss: '#3d5030',
  wine: '#8b2040',
  iris: '#6666aa',
} as const

// A step of gray between Bamboo's text and its backgrounds, for the quieter text.
const muted = { dark: '#a8a898', light: '#5f6658' } as const

/**
 * The palette, and what the design system says of its contrast. A line that
 * starts "Desktop won't paint this theme" means the desktop app ignores it all;
 * the test holds the list to none of those.
 */
export const { theme, problems } = makeColors({
  label: 'Bamboo',
  dark: {
    gray: {
      anchors: {
        // The page is Bamboo's background. The surfaces above it stop at bg1,
        // since a lighter menu costs the quiet text its contrast.
        'surface-0': vulgaris.bg0,
        'surface-1': '#292b27',
        'surface-2': '#2d2f2a',
        'surface-3': vulgaris.bg1,
        'text-primary': vulgaris.fg,
        'text-secondary': '#c9c2ab',
        'text-muted': muted.dark,
      },
    },
    // A pinned stop is the one dark mode's text reads, so the words are
    // Bamboo's own colors. Red is left to the design system: Bamboo's is just
    // under 4.5:1 on its own background.
    roles: {
      accent: { seed: vulgaris.green, stops: { 300: vulgaris.green } },
      danger: vulgaris.red,
      success: { seed: juliet.greenBright, stops: { 400: juliet.greenBright } },
      warning: { seed: vulgaris.yellow, stops: { 300: vulgaris.yellow } },
      pro: { seed: vulgaris.purple, stops: { 300: vulgaris.purple } },
    },
    git: {
      added: vulgaris.green,
      removed: vulgaris.coral,
      modified: vulgaris.bgBlue,
      merged: vulgaris.purple,
      closed: vulgaris.coral,
      conflicting: vulgaris.orange,
      draft: muted.dark,
    },
  },
  light: {
    gray: {
      anchors: {
        // Cream paper for the page, lightening to bamboo.nvim's light background.
        'surface-0': juliet.paper,
        'surface-1': '#f6f1d9',
        'surface-2': light.bg0,
        'text-primary': juliet.ink,
        'text-secondary': light.fg,
        'text-muted': muted.light,
      },
    },
    roles: {
      accent: juliet.moss,
      danger: juliet.wine,
      success: light.green,
      // A darker fill than the stock one, which fades into the cream.
      warning: { seed: light.yellow, fillShade: 300 },
      pro: juliet.iris,
    },
    git: {
      added: light.green,
      removed: light.red,
      modified: light.blue,
      merged: light.purple,
      closed: light.red,
      conflicting: light.orange,
      draft: muted.light,
    },
  },
})

export const LOOK: ThemeSetArgs = { colors: theme }
