import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response): void {
    const port = parseInt(process.env.PORT || '4000', 10);
    const html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Home Library Service</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
              color: #ffffff;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              text-align: center;
              max-width: 800px;
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              display: block;
            }
            h1 {
              font-size: 2.5rem;
              margin-bottom: 1.5rem;
              font-weight: 300;
              line-height: 1.4;
            }
            .port-info {
              font-size: 1.2rem;
              margin-bottom: 2rem;
              opacity: 0.9;
            }
            .docs-link {
              display: inline-block;
              margin-top: 2rem;
              padding: 12px 24px;
              background: rgba(255, 255, 255, 0.1);
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-radius: 8px;
              color: #ffffff;
              text-decoration: none;
              font-size: 1.1rem;
              transition: all 0.3s ease;
            }
            .docs-link:hover {
              background: rgba(255, 255, 255, 0.2);
              border-color: rgba(255, 255, 255, 0.5);
              transform: translateY(-2px);
            }
            .features {
              margin-top: 3rem;
              display: flex;
              justify-content: center;
              gap: 2rem;
              flex-wrap: wrap;
            }
            .feature {
              font-size: 2rem;
              opacity: 0.7;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <span class="icon">📚</span>
            <h1>${this.appService.getHello()}</h1>
            <div class="port-info">Running on port ${port}</div>
            <a href="http://localhost:${port}/doc" class="docs-link">
              📖 Explore API Documentation
            </a>
            <div class="features">
              <span class="feature">🎵</span>
              <span class="feature">🎨</span>
              <span class="feature">💿</span>
              <span class="feature">⭐</span>
            </div>
          </div>
        </body>
      </html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
