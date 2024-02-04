import { Test, TestingModule } from '@nestjs/testing';
import { PaypalPayService } from '../services/paypal-pay.service';

describe('PaypalPayService', () => {
  let service: PaypalPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaypalPayService],
    }).compile();

    service = module.get<PaypalPayService>(PaypalPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
