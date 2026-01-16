import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import crypto from "crypto";


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {

      const body = `{
  "originalKey": "original/user-123/abc.jpg",
  "images": {
    "thumb": "https://s3/.../thumb.jpg",
    "medium": "https://s3/.../medium.jpg",
    "large": "https://s3/.../large.jpg"
  }
}
`
      const payload = JSON.stringify(JSON.parse(body));
      console.log('payload', typeof payload)
      const signature = crypto
        .createHmac("sha256", 'webhook_secret')
        .update(payload)
        .digest("hex");

      console.log('signature: ', signature)

      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
