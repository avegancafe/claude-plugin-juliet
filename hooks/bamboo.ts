import type { Register } from 'claude-code'

import { LOOK } from './bamboo-look'

// Bamboo for the desktop and mobile apps. The terminal draws no look: there
// `themes/bamboo.json`, beside this folder, is the Bamboo that /theme lists.
export const register: Register = (on, options) => {
  on('session.start', async ($, e, next) => {
    if (options.bambooLook !== false) {
      try {
        // `isDrawn: false` is a session no app is drawing, which is no failure.
        await $.theme.set(LOOK)
      } catch (error) {
        $.ui.log(`bamboo: the look was not set: ${String(error)}`)
      }
    }

    return next(e)
  })
}
