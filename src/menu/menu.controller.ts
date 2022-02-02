import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemDto } from './dto/item.dto';
import { ReturnItemDto } from './dto/return-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Adicionar item ao menu',
  })
  @ApiBearerAuth()
  create(@Body() createItemDto: CreateItemDto): Promise<ReturnItemDto> {
    return this.menuService.create(createItemDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Buscar todos os itens do menu',
  })
  @ApiBearerAuth()
  getMenu(): Promise<ItemDto[]> {
    return this.menuService.getMenu();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Buscar um item do menu pelo id',
  })
  @ApiBearerAuth()
  findItem(@Param('id') itemId: string): Promise<ReturnItemDto> {
    return this.menuService.findItem(itemId);
  }

  @Patch()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Atualizar item do menu',
  })
  @ApiBearerAuth()
  update(
    @Param('id') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ReturnItemDto> {
    return this.menuService.update(itemId, updateItemDto);
  }

  @Delete()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Deletar item do menu',
  })
  @ApiBearerAuth()
  delete(@Param('id') itemId: string) {
    return this.menuService.delete(itemId);
  }
}
