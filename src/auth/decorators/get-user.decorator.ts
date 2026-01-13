import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (data) {
            return request.user[data]; // Lấy 1 thuộc tính cụ thể (ví dụ: 'email')
        }
        return request.user; // Lấy cả object user
    },
);