import { AppConfigService } from "./app-config.service";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
    exports: [AppConfigService],
    imports: [ConfigModule.forRoot()],
    providers: [AppConfigService]
})
export class AppConfigurationModule {}