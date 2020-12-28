import chalk from 'chalk'

export const reporter = {
  info: (msg?: string) => console.log(`${chalk.black.blue('info ')}  - ${msg}`),
  warn: (msg?: string) =>
    console.log(`${chalk.black.yellow('warn ')}  - ${msg}`),
  fail: (msg?: string) => console.log(`${chalk.black.red('fail ')}  - ${msg}`),
  done: (msg?: string) =>
    console.log(`${chalk.black.green('done ')}  - ${msg}`),
}
