import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common';
import { StoreCreateDto } from './dto/store-create.dto';
import { StoreListDto } from './dto/store-list.dto';
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

    @Get()
    async GetStoreList(@Query() storeListData: StoreListDto) {
        try {
            let { offset, limit } = storeListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const stores = await this.storeService.getList({ offset, limit } as StoreListDto);
            return stores;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
