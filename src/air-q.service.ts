import { Injectable } from '@nestjs/common';

const URL = `http://api.waqi.info/feed/@${process.env.STATION_ID}/?token=${process.env.API_TOKEN}`;

@Injectable()
export class AirQService {
  public async onMessage() {
    try {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
}
