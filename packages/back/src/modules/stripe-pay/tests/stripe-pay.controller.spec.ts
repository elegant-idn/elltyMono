import { Test, TestingModule } from '@nestjs/testing';
import { StripePayController } from '../stripe-pay.controller';
import { StripePayService } from '../services/stripe-pay.service';

describe('StripePayController', () => {
  let controller: StripePayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripePayController],
      providers: [StripePayService],
    }).compile();

    controller = module.get<StripePayController>(StripePayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
