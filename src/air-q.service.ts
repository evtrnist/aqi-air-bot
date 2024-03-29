import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

const URL = `https://api.waqi.info/feed/${process.env.STATION_ID}/?token=${process.env.API_TOKEN}`;
@Injectable()
export class AirQService {
  constructor(private readonly httpService: HttpService) {}
  public onMessage$(): Observable<AxiosResponse<any, any>> {
    return this.httpService.get(URL);

    // try {
    //   const response = await fetch(OTHER_URL, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   const data = await response.json();

    //   return data;
    // } catch (error) {
    //   throw error;
    // }
  }
}
