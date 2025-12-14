import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  private readonly publicRoutes = ['/auth/signup', '/auth/login', '/doc', '/'];

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const { url, method } = request;

    // Check if route is public
    if (this.isPublicRoute(url)) {
      return true;
    }

    // Check for authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private isPublicRoute(url: string): boolean {
    // Check exact matches
    if (this.publicRoutes.includes(url)) {
      return true;
    }

    // Check if URL starts with /doc (for Swagger documentation)
    if (url.startsWith('/doc')) {
      return true;
    }

    return false;
  }
}
