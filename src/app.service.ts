import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to Home Library Service<br>Your personal music collection manager`;
  }
}
