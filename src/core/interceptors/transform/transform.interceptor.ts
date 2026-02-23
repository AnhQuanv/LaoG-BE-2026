import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // 1. Import Reflector
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';
import { RESPONSE_MESSAGE } from '../../../core/decorators/response-message.decorator';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface ControllerResponse<T> {
  message?: string;
  result?: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();
    const statusCode = response.statusCode;

    // 3. Đọc metadata từ Decorator @ResponseMessage
    const decoratorMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data: T | ControllerResponse<T>) => {
        const isObject = data && typeof data === 'object';
        const resData = isObject ? (data as ControllerResponse<T>) : null;

        return {
          success: true,
          statusCode: statusCode,
          // 4. Thứ tự ưu tiên:
          // - Message trả về trực tiếp từ code (resData?.message)
          // - Nếu không có, dùng message từ Decorator (decoratorMessage)
          // - Nếu vẫn không có, dùng mặc định
          message:
            resData?.message || decoratorMessage || 'Thao tác thành công',
          data: (resData?.result !== undefined ? resData.result : data) as T,
        };
      }),
    );
  }
}
