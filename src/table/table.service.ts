import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { States } from 'src/shared/enums';
import { ReturnCloseTableDto } from './dto/close-table-return.dto';
import { CreateTableDto } from './dto/create-table.dto';
import { ReturnTableDto } from './dto/return-table.dto';
import { TableDto } from './dto/table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TableService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createTableDto: CreateTableDto,
    userId: string,
  ): Promise<ReturnTableDto> {
    const tableNumberExists = this.prismaService.table.findUnique({
      where: { number: createTableDto.number },
    });

    if (tableNumberExists) {
      throw new ConflictException('Table already exists');
    }

    const createdTable = await this.prismaService.table.create({
      data: {
        number: createTableDto.number,
        user: {
          connect: {
            id: userId,
          },
        },
        couvert: false,
        service: false,
        items: [],
        state: States['CLOSED'],
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: createdTable.userId },
    });

    return {
      table: { ...createdTable, user: findedUser },
      message: 'Table was created successfully',
    };
  }

  async findMany(): Promise<TableDto[]> {
    const tables = await this.prismaService.table.findMany({
      select: {
        id: true,
        number: true,
        user: true,
        items: true,
        state: true,
        service: true,
        couvert: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return tables;
  }

  async findUnique(tableId: string): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Item not found');
    }

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...tableFinded, user: findedUser },
      message: 'Table was created successfully',
    };
  }

  async findByNumber(tableNumber: number): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { number: tableNumber },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...tableFinded, user: findedUser },
      message: 'Table finded',
    };
  }

  async updateTable(
    tableId: string,
    updateTableDto: UpdateTableDto,
  ): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        items: updateTableDto.items,
        couvert: updateTableDto.couvert,
        state: updateTableDto.state,
        service: updateTableDto.service,
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      message: 'Table was updated successfully',
    };
  }

  async openTable(tableId: string): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        state: { set: States['OPEN'] },
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      message: 'Table state is now open',
    };
  }

  async closeTable(tableId: string): Promise<ReturnCloseTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    const itemsOnTable = await this.prismaService.item.findMany({
      where: {
        id: {
          in: tableFinded.items,
        },
      },
    });

    const getTotalValue = () => {
      let totalValue = 0;

      const totalFromItems = itemsOnTable
        .map((item) => Number(item.price))
        .reduce((soma, i) => soma + i);

      totalValue += totalFromItems;
      if (tableFinded.couvert) {
        totalValue += 10;
      }

      if (tableFinded.service) {
        totalValue += totalValue * 0.1;
      }

      return totalValue;
    };

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        items: {
          set: [],
        },
        couvert: { set: false },
        service: { set: false },
        state: { set: States['CLOSED'] },
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      total: getTotalValue(),
      message: 'Table state is now closed',
    };
  }

  async getPartialValue(tableId: string): Promise<ReturnCloseTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    const itemsOnTable = await this.prismaService.item.findMany({
      where: {
        id: {
          in: tableFinded.items,
        },
      },
    });

    const getTotalValue = () => {
      let totalValue = 0;

      const totalFromItems = itemsOnTable
        .map((item) => Number(item.price))
        .reduce((soma, i) => soma + i);

      totalValue += totalFromItems;
      if (tableFinded.couvert) {
        totalValue += 10;
      }

      if (tableFinded.service) {
        totalValue += totalValue * 0.1;
      }

      return totalValue;
    };

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...tableFinded, user: findedUser },
      total: getTotalValue(),
      message: 'Total partial',
    };
  }

  async addItemToTable(
    tableId: string,
    itemId: string,
  ): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    if (tableFinded.state === States['CLOSE']) {
      throw new ConflictException('Table must be Opened to add items');
    }

    const itemExists = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });

    if (!itemExists) {
      throw new ConflictException('Item not found');
    }

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        items: {
          push: itemId,
        },
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      message: 'Item successfully added to table',
    };
  }

  async removeItemFromTable(
    tableId: string,
    itemId: string,
  ): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    const itemExists = tableFinded.items.includes(itemId);

    if (!itemExists) {
      throw new NotFoundException('Item is not on this table');
    }

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        items: {
          set: tableFinded.items.filter((item) => item !== itemId),
        },
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      message: 'Item successfully removed from table',
    };
  }

  async setCouvertState(tableId: string): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    if (tableFinded.state === States['CLOSE']) {
      throw new ConflictException('Table must be Opened to activate couvert');
    }

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        couvert: !tableFinded.couvert,
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      message: `Couvert is now ${updatedTable.couvert ? 'active' : 'deactive'}`,
    };
  }

  async setServiceState(tableId: string): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    if (tableFinded.state === States['CLOSE']) {
      throw new ConflictException('Table must be Opened to activate service');
    }

    const updatedTable = await this.prismaService.table.update({
      where: { id: tableId },
      data: {
        service: !tableFinded.service,
      },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...updatedTable, user: findedUser },
      message: `Table state is now ${
        updatedTable.service ? 'active' : 'deactive'
      }`,
    };
  }

  async delete(tableId: string): Promise<ReturnTableDto> {
    const tableFinded = await this.prismaService.table.findUnique({
      where: { id: tableId },
    });

    if (!tableFinded) {
      throw new NotFoundException('Table not found');
    }

    if (tableFinded.state === States['OPEN']) {
      throw new ConflictException('Table must be closed to be deleted');
    }

    const deletedItem = await this.prismaService.table.delete({
      where: { id: tableId },
    });

    const findedUser = await this.prismaService.user.findUnique({
      where: { id: tableFinded.userId },
    });

    return {
      table: { ...deletedItem, user: findedUser },
      message: `Table deleted successfully`,
    };
  }
}
