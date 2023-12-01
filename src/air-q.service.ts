import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

const URL = `https://api.waqi.info/feed/${process.env.STATION_ID}/?token=${process.env.API_TOKEN}`;

@Injectable()
export class AirQService {
  constructor(private readonly httpService: HttpService) {}
  public async onMessage() {
    try {
      const response = await fetch(URL, {
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
