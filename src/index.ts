import { NestFactory } from "@nestjs/core"
import { AppModule } from "src/modules/app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

const port = process.env.FLASHFORGE_PORT || 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle("Flashforge API")
    .setDescription("API documentation for FlashforgeJS server")
    .setVersion("1.0")
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, documentFactory)

  app.getHttpAdapter().get("/", (_, res) => {
    res.redirect("/api")
  })

  await app.listen(port)

  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap application:", err)
  process.exit(1)
})
