/* eslint-disable global-require */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await require('pino');
    await require('next-logger');
  }
}

export default register;
