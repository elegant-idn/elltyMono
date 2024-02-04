import { Test, TestingModule } from '@nestjs/testing';
import { YookassaPayController } from '../yookassa-pay.controller';

describe('YookassaPayController', () => {
  let controller: YookassaPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YookassaPayController],
    }).compile();

    controller = module.get<YookassaPayController>(YookassaPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
