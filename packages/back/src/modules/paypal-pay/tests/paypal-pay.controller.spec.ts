import { Test, TestingModule } from '@nestjs/testing';
import { PaypalPayController } from '../paypal-pay.controller';
import { PaypalPayService } from '../services/paypal-pay.service';

describe('PaypalPayController', () => {
  let controller: PaypalPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaypalPayController],
      providers: [PaypalPayService],
    }).compile();

    controller = module.get<PaypalPayController>(PaypalPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
