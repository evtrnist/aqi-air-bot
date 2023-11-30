import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

const URL = `http://api.waqi.info/feed/@${process.env.STATION_ID}/?token=${process.env.API_TOKEN}`;

@Injectable()
export class AirQService {
  constructor(private readonly httpService: HttpService) {}
  public async onMessage() {
    try {
      let data;

      this.httpService.get(URL).subscribe((res) => {
        data = res;
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
