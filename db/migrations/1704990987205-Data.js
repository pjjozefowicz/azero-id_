module.exports = class Data1704990987205 {
    name = 'Data1704990987205'

    async up(db) {
        await db.query(`CREATE TABLE "domain" ("id" character varying NOT NULL, "registration_date" TIMESTAMP WITH TIME ZONE NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL, "owner_id" character varying, CONSTRAINT "PK_27e3ec3ea0ae02c8c5bceab3ba9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4e21006496ef49995f4cf5ff8c" ON "domain" ("owner_id") `)
        await db.query(`CREATE INDEX "IDX_9c1068f43d7a8543c32601baa5" ON "domain" ("registration_date") `)
        await db.query(`CREATE TABLE "owner" ("id" character varying NOT NULL, CONSTRAINT "PK_8e86b6b9f94aece7d12d465dc0c" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_4e21006496ef49995f4cf5ff8c4" FOREIGN KEY ("owner_id") REFERENCES "owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "domain"`)
        await db.query(`DROP INDEX "public"."IDX_4e21006496ef49995f4cf5ff8c"`)
        await db.query(`DROP INDEX "public"."IDX_9c1068f43d7a8543c32601baa5"`)
        await db.query(`DROP TABLE "owner"`)
        await db.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_4e21006496ef49995f4cf5ff8c4"`)
    }
}
