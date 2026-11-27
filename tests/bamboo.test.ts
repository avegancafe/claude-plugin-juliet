import { expect, test } from 'claude-code/testing'
import type { On, ThemeSetArgs } from 'claude-code'

import { problems } from '../hooks/bamboo-look'

/** The engine beneath the mod: it starts a session and records each theme set. */
const engine = (on: On) => {
  const sets: ThemeSetArgs[] = []

  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('theme.set', (_, e) => {
    sets.push(e)

    return { value: { isDrawn: true, requestId: 'theme' } }
  })

  return sets
}

test('a session starts in Bamboo, light and dark', async ($, on) => {
  const sets = engine(on)

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(sets.length).toBe(1)

  const colors = sets[0]?.colors

  expect(colors?.label).toBe('Bamboo')
  // The page is bamboo.nvim's background in dark, and Juliet's cream in light.
  expect(colors?.inputs.dark?.['gray-900']).toBe('#252623')
  expect(colors?.inputs.light?.['gray-20']).toBe('#f1e9d2')
  // Dark mode's accent text is Bamboo's green itself.
  expect(colors?.inputs.dark?.['role-accent-300']).toBe('#8fb573')
})

test('turned off, a session keeps its own look', { options: { bambooLook: false } }, async ($, on) => {
  const sets = engine(on)

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(sets.length).toBe(0)
})

test('a build that refuses the look still starts the session', async ($, on) => {
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('theme.set', () => {
    throw new Error('colors: not taken by this build')
  })
  on('ui.log', () => ({ value: undefined }))

  const started = await $.session.start({ cwd: '/work', surface: 'desktop', isInteractive: true })

  expect(started.cwd).toBe('/work')
})

test('the desktop app paints the palette', () => {
  expect(problems.filter(line => line.startsWith("Desktop won't paint"))).toEqual([])
})
