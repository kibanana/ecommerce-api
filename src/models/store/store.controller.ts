import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { StoreCreateDto } from './dto/storeCreate.dto';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
    constructor(private storeService: StoreService) {}

    @Post()
    async CreateStore(@Body() storeCreateData: StoreCreateDto) {
        try {
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
