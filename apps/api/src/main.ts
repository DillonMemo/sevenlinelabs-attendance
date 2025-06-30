import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { type NestExpressApplication } from "@nestjs/platform-express"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: false,
    logger: ["error", "warn", "debug", "log", "verbose"],
  })
  const configService = app.get<ConfigService>(ConfigService)

  const allowedOrigins =
    configService.get("NODE_ENV") !== "local"
      ? (configService.get("CORS_ORIGINS") as string).split(",")
      : "*"

  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })

  await app.listen(process.env.PORT || 4000)

  Logger.log(`🧑‍💻 Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch((error) => {
  Logger.error(`Error during application bootstrap: ${error}`)
  process.exit(1)
})
