import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

const URL = `https://api.waqi.info/feed/@${process.env.STATION_ID}/?token=${process.env.API_TOKEN}`;
const OTHER_URL = `https://data.sensor.community/airrohr/v1/sensor/${process.env.STATION_ID}`
@Injectable()
export class AirQService {
  constructor(private readonly httpService: HttpService) {}
  public async onMessage() {
    try {
      const response = await fetch(OTHER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
}
