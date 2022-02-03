import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { LoggedUser } from 'src/auth/logged-user-decorator';
import { ReturnCloseTableDto } from './dto/close-table-return.dto';
import { CreateTableDto } from './dto/create-table.dto';
import { ReturnTableDto } from './dto/return-table.dto';
import { TableDto } from './dto/table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableService } from './table.service';

@ApiTags('table')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Criar mesa',
  })
  @ApiBearerAuth()
  create(
    @LoggedUser() user: User,
    @Body() createTableDto: CreateTableDto,
  ): Promise<ReturnTableDto> {
    return this.tableService.create(createTableDto, user.id);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Buscar todas as mesas',
  })
  @ApiBearerAuth()
  findMany(): Promise<TableDto[]> {
    return this.tableService.findMany();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Buscar uma mesa pelo id',
  })
  @ApiBearerAuth()
  findById(@Param('id') tableId: string): Promise<ReturnTableDto> {
    return this.tableService.findUnique(tableId);
  }

  @Get(':number')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Buscar uma mesa pelo número',
  })
  @ApiBearerAuth()
  findByNumber(@Param('number') tableNumber: string): Promise<ReturnTableDto> {
    return this.tableService.findByNumber(Number(tableNumber));
  }

  @Get('partial/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Buscar valor parcial da mesa',
  })
  @ApiBearerAuth()
  getPartial(@Param('id') tableId: string): Promise<ReturnCloseTableDto> {
    return this.tableService.getPartialValue(tableId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Atualizar dados da mesa',
  })
  @ApiBearerAuth()
  update(
    @Param('id') tableId: string,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<ReturnTableDto> {
    return this.tableService.updateTable(tableId, updateTableDto);
  }

  @Put('open/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Abrir mesa',
  })
  @ApiBearerAuth()
  openTable(@Param('id') tableId: string): Promise<ReturnTableDto> {
    return this.tableService.openTable(tableId);
  }

  @Put('close/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Encerrar mesa',
  })
  @ApiBearerAuth()
  closeTable(@Param('id') tableId: string): Promise<ReturnCloseTableDto> {
    return this.tableService.closeTable(tableId);
  }

  @Put('couvert/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Ativar/Desativar Couvert na mesa',
  })
  @ApiBearerAuth()
  updateCouvert(@Param('id') tableId: string): Promise<ReturnTableDto> {
    return this.tableService.setCouvertState(tableId);
  }

  @Put('service/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Ativar/Desativar taxa de serviço na mesa',
  })
  @ApiBearerAuth()
  updateService(@Param('id') tableId: string): Promise<ReturnTableDto> {
    return this.tableService.setServiceState(tableId);
  }

  @Put('addItem/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Adicionar um item da mesa',
  })
  @ApiBearerAuth()
  addItem(
    @Param('id') tableId: string,
    @Body() itemId: string,
  ): Promise<ReturnTableDto> {
    return this.tableService.addItemToTable(tableId, itemId);
  }

  @Put('removeItem/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Remover um item da mesa',
  })
  @ApiBearerAuth()
  removeItem(
    @Param('id') tableId: string,
    @Body() itemId: string,
  ): Promise<ReturnTableDto> {
    return this.tableService.removeItemFromTable(tableId, itemId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Deletar mesa',
  })
  @ApiBearerAuth()
  delete(@Param('id') tableId: string) {
    return this.tableService.delete(tableId);
  }
}
