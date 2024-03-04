import Database from "@ioc:Adonis/Lucid/Database";

export default class GlobalController {
  public getDepartments = async (idFuncionario: number) => {
    let departamentos = await Database.connection("pg").rawQuery(`
            SELECT fa.id_area,ar.area
            FROM ml_ctr_funcionario_area fa INNER JOIN ml_ctr_programa_area ar ON (fa.id_area = ar.id_area)
            WHERE fa.id_funcionario = ${idFuncionario}
        `);

    return departamentos.rows;
  };
}
