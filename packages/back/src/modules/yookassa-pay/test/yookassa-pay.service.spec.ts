import { Test, TestingModule } from '@nestjs/testing';
import { YookassaPayService } from '../yookassa-pay.service';

describe('YookassaPayService', () => {
  let service: YookassaPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YookassaPayService],
    }).compile();

    service = module.get<YookassaPayService>(YookassaPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
