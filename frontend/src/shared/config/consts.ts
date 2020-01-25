// export const API_URL = 'http://192.168.1.6:3000'
export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://zapisy.wydarzenia.napwr.pl'
