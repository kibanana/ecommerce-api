import { Module } from '@nestjs/common';
import { CustomFieldController } from './custom-field.controller';
import { CustomFieldService } from './custom-field.service';

@Module({
  controllers: [CustomFieldController],
  providers: [CustomFieldService]
})
export class CustomFieldModule {}
