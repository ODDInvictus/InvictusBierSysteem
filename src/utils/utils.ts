import config from '../../config.json'

export const setTitle = (title: string) => {
  document.title = 'IBS :: ' + title
}

export const getConfig = () => {
  return config
}