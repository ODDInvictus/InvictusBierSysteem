import config from '../../config.json'

export const setTitle = (title: string) => {
  const prefix = config.app.shortName || 'config.app.shortName'
  document.title = `${prefix} :: ${title}`
}

export function getConfig() {
  return config
}