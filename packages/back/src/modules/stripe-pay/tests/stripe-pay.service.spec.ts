import { Test, TestingModule } from '@nestjs/testing';
import { StripePayService } from '../services/stripe-pay.service';

describe('StripePayService', () => {
  let service: StripePayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripePayService],
    }).compile();

    service = module.get<StripePayService>(StripePayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
