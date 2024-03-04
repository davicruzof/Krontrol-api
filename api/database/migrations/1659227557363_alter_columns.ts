import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "ml_fol_funcionario";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("id_situacao").defaultTo(1).alter();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, () => {});
  }
}
