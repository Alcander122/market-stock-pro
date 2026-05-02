const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin123",
    database: "fruver_base_template",
});

AppDataSource.initialize()
    .then(async () => {
        await AppDataSource.query(`ALTER TABLE productos ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'`);
        console.log("Columna metadata (JSONB) anadida exitosamente a productos.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error al anadir columna:", error);
        process.exit(1);
    });
