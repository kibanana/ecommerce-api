import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetStoreListDto } from './dto/get-store-list.dto';
import { UpdateStorePasswordDto } from './dto/update-store-password.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
    constructor(private storeService: StoreService) {}

    @Post()
    async CreateStore(@Body() createStoreData: CreateStoreDto) {
        try {
            const doesExist = await this.storeService.doesExist(createStoreData.email, createStoreData.name);
            if (doesExist) {
                throw new HttpException('ERR_STORE_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const store = await this.storeService.createItem(createStoreData);
            return { id: store._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async GetStoreList(@Query() getStoreListData: GetStoreListDto) {
        try {
            let { offset, limit } = getStoreListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const data = await this.storeService.getList({ offset, limit } as GetStoreListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/me')
    async GetStore(@Request() req) {
        try {
            const { id } = req.user;

            const store = await this.storeService.getItemById(id);
            if (!store) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            
            return store;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/me')
    async UpdateStore(@Body() updateStoreData: UpdateStoreDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const doesExist = await this.storeService.doesExist(updateStoreData.email, updateStoreData.name);
            if (doesExist) {
                throw new HttpException('ERR_STORE_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const result = await this.storeService.updateItem(store, updateStoreData);
            if (!result) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/me/password')
    async UpdateStorePassword(@Body() updateStorePasswordData: UpdateStorePasswordDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const isDuplicated = updateStorePasswordData.oldPassword === updateStorePasswordData.newPassword;
            if (isDuplicated) {
                throw new HttpException('ERR_DUPLICATED_PARAM', HttpStatus.CONFLICT);
            }

            const isCertified = await this.storeService.comparePassword(store, updateStorePasswordData);
            if (!isCertified) {
                throw new HttpException('ERR_INVALID_ACCESS', HttpStatus.FORBIDDEN);
            }

            const result = await this.storeService.updateItemPasssword(store, updateStorePasswordData);
            if (!result) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Delete('/me')
    async DeleteStore(@Request() req) {
        try {
            const { id: store } = req.user;

            const result = await this.storeService.deleteItem(store);
            if (!result) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
