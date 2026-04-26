export interface WeatherParams {
  key: string
  location: string
}

export interface WeatherNowData {
  cloud?: string
  dew?: string
  feelsLike?: string
  humidity?: string
  icon?: string
  obsTime?: string
  precip?: string
  pressure?: string
  temp?: string
  text?: string
  vis?: string
  wind360?: string
  windDir?: string
  windScale?: string
  windSpeed?: string
}

export interface WeatherResponse {
  code: string
  fxLink?: string
  now?: WeatherNowData
  refer?: {
    license?: string[]
    sources?: string[]
  }
  updateTime?: string
}
