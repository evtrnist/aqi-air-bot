import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  public getData$(mapPoint: string): Observable<any> {
    return from(axios.get(this.getUrl(mapPoint))).pipe(
      map((response: AxiosResponse<any>) => response.data),
      catchError((error) => throwError(() => error)),
    );
  }

  private getUrl(mapPoint: string): string {
    return `https://api.waqi.info/feed/A${mapPoint}/?token=${process.env.API_TOKEN}`;
  }
}
