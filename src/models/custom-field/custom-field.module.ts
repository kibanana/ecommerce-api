import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomFieldController } from './custom-field.controller';
import { CustomFieldService } from './custom-field.service';
import { StoreModule } from '../store/store.module';
import { CustomField, CustomFieldSchema } from './schema/custom-field.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: CustomField.name, schema: CustomFieldSchema }]),
		StoreModule,
	],
	controllers: [CustomFieldController],
	providers: [CustomFieldService],
})
export class CustomFieldModule {}
