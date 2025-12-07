import { Module } from "@nestjs/common";
import { PrinterModule } from "src/modules/printer/printer.module";

@Module({
  imports: [PrinterModule],
})
export class AppModule {}
