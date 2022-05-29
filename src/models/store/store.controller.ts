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
import { StoreCreateDto } from './dto/store-create.dto';
import { StoreListDto } from './dto/store-list.dto';
import { StorePasswordUpdateDto } from './dto/store-password-update.dto';
import { StoreUpdateDto } from './dto/store-update.dto';
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

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/me')
    async UpdateStore(@Body() storeUpdateData: StoreUpdateDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const doesExistByEmail = await this.storeService.doesExistByEmail(storeUpdateData.email);
            if (doesExistByEmail) {
                throw new HttpException('ERR_STORE_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const doesExistByName = await this.storeService.doesExistByName(storeUpdateData.name);
            if (doesExistByName) {
                throw new HttpException('ERR_STORE_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const result = await this.storeService.updateItem(store, storeUpdateData);
            if (!result) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            return;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/me/password')
    async UpdateStorePassword(@Body() storeUpdatePasswordData: StorePasswordUpdateDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const isDuplicated = storeUpdatePasswordData.oldPassword === storeUpdatePasswordData.newPassword;
            if (isDuplicated) {
                throw new HttpException('ERR_PASSWORD_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const isCertified = await this.storeService.comparePassword(store, storeUpdatePasswordData);
            if (!isCertified) {
                throw new HttpException('ERR_INVALID_ACCESS', HttpStatus.FORBIDDEN);
            }

            const result = await this.storeService.updateItemPasssword(store, storeUpdatePasswordData);
            if (!result) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            return;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
