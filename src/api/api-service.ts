import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  public getData$(mapPoint: string): Observable<AxiosResponse<any, any>> {
    return this.httpService
      .get(this.getUrl(mapPoint))
      .pipe(map((result) => result.data));
  }

  private getUrl(mapPoint: string): string {
    return `https://api.waqi.info/feed/${mapPoint}/?token=${process.env.API_TOKEN}`;
  }
}
