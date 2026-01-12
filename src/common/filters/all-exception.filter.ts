import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private logger = new Logger('Exception');

    catch(exception: any, host: ArgumentsHost) {
        this.logger.error(
            exception.message,
            exception.stack,
        );
        throw exception;
    }
}