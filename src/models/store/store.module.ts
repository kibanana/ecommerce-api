
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store, StoreSchema } from './schema/store.schema';

@Module({
    imports: [
      MongooseModule.forFeatureAsync([
        {
            name: Store.name,
            useFactory: () => {
                const schema = StoreSchema;
                schema.pre('save', async function () {
                    const store = this;
                    const hashedPassword = await bcrypt.hash(store.password, (await bcrypt.genSalt()));
                    store.password = hashedPassword
                });
                return schema;
            },
        },
      ]),
    ],
    providers: [StoreService],
    controllers: [StoreController]
})
export class StoreModule {}
