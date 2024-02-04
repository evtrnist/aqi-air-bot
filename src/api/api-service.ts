import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ApiService {
  public async getData(mapPoint: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.get(
        this.getUrl(mapPoint),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private getUrl(mapPoint: string): string {
    return `https://api.waqi.info/feed/${mapPoint}/?token=${process.env.API_TOKEN}`;
  }
}
