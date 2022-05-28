import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { StoreCreateDto } from './dto/store-create.dto';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
    constructor(private storeService: StoreService) {}

    @Post()
    async CreateStore(@Body() storeCreateData: StoreCreateDto) {
        try {
            const doesExistByEmail = await this.storeService.doesExistByEmail(storeCreateData.email);
            if (doesExistByEmail) {
                throw new HttpException('ERR_STORE_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }
            
            const doesExistByName = await this.storeService.doesExistByName(storeCreateData.name);
            if (doesExistByName) {
                throw new HttpException('ERR_STORE_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const store = await this.storeService.createItem(storeCreateData);
            return { id: store._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
