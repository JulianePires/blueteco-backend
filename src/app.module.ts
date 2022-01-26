import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { TableModule } from './table/table.module';

@Module({
  imports: [UserModule, MenuModule, TableModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
