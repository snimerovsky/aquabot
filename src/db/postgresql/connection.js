const Pool = require("pg").Pool;

export default class PostgresSqlConnector {
    constructor(app, dbconfig) {
        this.app = app;
        this.connect(dbconfig);
    }

    connect = ({ user, host, database, password, port }) => {
        this.db = new Pool({
            user,
            host,
            database,
            password,
            port,
        });
    };

    getAllFromTable = async (table_name, select = "*", order_by) => {
        const { rows } = await this.db.query(`SELECT ${select} FROM ${table_name} ${order_by}`);
        return rows;
    };

    getAllFromTableWithJoin = async (table_name, join, select = "*", order_by = '') => {
        const { rows } = await this.db.query(`SELECT ${select} FROM ${table_name} LEFT JOIN ${join} ${order_by}`);
        return rows;
    };

    getAllFromTableWithCondition = async ({
                                              table_name,
                                              condition_key,
                                              condition_value,
                                              select = "*",
                                              is_json = true,
                                              equals = "=",
                                          }) => {
        const {
            rows,
        } = await this.db.query(
            `SELECT ${select} FROM ${table_name} WHERE ${condition_key} ${equals} $1`,
            [condition_value]
        );
        if (is_json) return JSON.stringify(rows);
        return rows;
    };

    getAllFromTableWithManyConditions = async (
        table_name,
        condition_keys,
        condition_value,
        select = "*",
        order_by = '',
        is_json = false
    ) => {
        const {
            rows,
        } = await this.db.query(
            `SELECT ${select} FROM ${table_name} WHERE ${condition_keys} ${order_by}`,
            condition_value
        );
        if (is_json) return JSON.stringify(rows);
        return rows;
    };

    getAllFromTableWithManyConditionsAndJoin = async (
        table_name,
        condition_keys,
        condition_value,
        join,
        select = "*",
        order_by = '',
        is_json = false
    ) => {
        const {
            rows,
        } = await this.db.query(
            `SELECT ${select} FROM ${table_name} LEFT JOIN ${join} WHERE ${condition_keys} ${order_by}`,
            condition_value
        );
        if (is_json) return JSON.stringify(rows);
        return rows;
    };

    getDataFromTableWithOwnCondition = async ({
                                                  table_name,
                                                  condition,
                                                  select = "*",
                                                  is_json = true,
                                              }) => {
        const { rows } = await this.db.query(
            `SELECT ${select} FROM ${table_name} WHERE ${condition}`
        );
        if (is_json) return JSON.stringify(rows);
        return rows;
    };

    addDataToTable = async (table_name, keys, values, data_values) => {
        const { rows } = await this.db.query(
            `INSERT INTO ${table_name} (${keys}) VALUES (${values}) ON CONFLICT DO NOTHING RETURNING id`,
            data_values
        );
        return rows
    };

    setDataInTable = async (table_name, values, condition, data_values) => {
        await this.db.query(
            `UPDATE ${table_name} SET ${values} WHERE ${condition}`,
            data_values
        );
    };

    removeDataInTable = async (table_name, condition, data_values) => {
        await this.db.query(
            `DELETE FROM ${table_name} WHERE ${condition}`,
            data_values
        );
    };
}
