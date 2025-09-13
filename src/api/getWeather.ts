import type { WeatherParams, WeatherResponse } from '@/types/weather.d'
import { get } from '@/utils/request'

/**
 * 获取当前天气信息
 * @param location 位置坐标，格式：经度,纬度
 * @param key API密钥
 * @returns 天气数据
 */
export const getWeather = (
  location: string = '121.267638,37.49833',
  key: string = 'ee5efe84f7664cb9b5c8b93abb8b9fea',
): Promise<WeatherResponse> => {
  const params: WeatherParams = { key, location }

  return get<WeatherResponse>(
    'https://devapi.qweather.com/v7/weather/now',
    params,
    {
      baseURL: '', // 取消baseURL
      validateStatus: () => true, // 禁用状态码验证
      withCredentials: false, // 不携带cookie
    },
  )
}
