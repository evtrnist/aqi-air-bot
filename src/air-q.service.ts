import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

const URL = `http://api.waqi.info/feed/@${process.env.STATION_ID}/?token=${process.env.API_TOKEN}`;

@Injectable()
export class AirQService {
  constructor(private readonly httpService: HttpService) {}
  public async onMessage() {
    try {
      const response = await axios.post(URL);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
