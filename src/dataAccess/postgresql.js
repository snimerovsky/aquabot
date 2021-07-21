export default class PostgreSqlDataBase {
    constructor(app) {
        this.app = app;
    }

    setDb = (db) => {
        this.db = db
    }

    getConditionsWithTypes = (data, types) => {
        let keys = Object.keys(data);
        let conditionKeys = "";
        let conditionValues = [];

        for (let i in keys) {
            i = parseInt(i);
            conditionKeys += `${keys[i]} = $${i + 1}`;
            if (i !== keys.length - 1) {
                conditionKeys += " and ";
            }

            let data_to_push = data[`${keys[i]}`]
            if (types[i] === 'int') {
                data_to_push = +data_to_push
            }
            conditionValues.push(data_to_push);
        }

        return [conditionKeys, conditionValues]
    }

    getConditions = (data) => {
        let keys = Object.keys(data);
        let stringKeys = "";
        let stringValues = "";
        let arrayValues = [];
        for (let i in keys) {
            i = parseInt(i);
            stringKeys += keys[i];
            stringValues += `$${i + 1}`;
            if (i !== keys.length - 1) {
                stringKeys += ", ";
                stringValues += ", ";
            }

            arrayValues.push(data[`${keys[i]}`]);
        }

        return [stringKeys, stringValues, arrayValues]
    }

    /*
    @params:
    {
      columnName: string,
      data: {
        key: value
      },
      types: ['int/string']
    }

    @return: Array
    */
    getTableData = async (body) => {
        let data;
        if (body.join && body.data) {
            let [conditionKeys, conditionValues] = this.getConditionsWithTypes(body.data, body.types)
            data = await this.db.getAllFromTableWithManyConditionsAndJoin(body.columnName, conditionKeys, conditionValues, body.join, body.select, body.order_by);
        }
        else if (body.join) {
            data = await this.db.getAllFromTableWithJoin(body.columnName, body.join, body.select, body.order_by ? body.order_by : '');
        } else if (body.data) {
            let [conditionKeys, conditionValues] = this.getConditionsWithTypes(body.data, body.types)
            data = await this.db.getAllFromTableWithManyConditions(body.columnName, conditionKeys, conditionValues, body.select ? body.select : '*', body.order_by ? body.order_by : '');
        } else {
            data = await this.db.getAllFromTable(body.columnName, '*', body.order_by ? body.order_by : '');
        }

        return data
    }

    /*
    @params:
    {
      columnName: string,
      data: {
        key: value
      }
    }

    @return: null
    */
    createTableData = async (body) => {
        let [stringKeys, stringValues, arrayValues] = this.getConditions(body.data)

        let rows = await this.db.addDataToTable(
            body.columnName,
            stringKeys,
            stringValues,
            arrayValues
        );

        if (rows.length > 0) {
            return rows[0]['id']
        } else {
            return undefined
        }
    }

    /*
    @params:
    {
      columnName: string,
      id: int,
      data: {
        key: value
      }
    }

    @return: null
    */
    updateTableData = async (body) => {
        let keys = Object.keys(body.data);
        let stringValues = "";
        let arrayValues = [];
        let lastId = 0;
        for (let i in keys) {
            i = parseInt(i);
            stringValues += `${keys[i]} = $${i + 1}`;
            if (i !== keys.length - 1) {
                stringValues += ", ";
            }

            arrayValues.push(body.data[`${keys[i]}`]);
            lastId = i + 2;
        }
        arrayValues.push(body.id);

        await this.db.setDataInTable(
            body.columnName,
            stringValues,
            `id = $${lastId}`,
            arrayValues
        );
    }

    /*
    @params:
    {
      columnName: string,
      data: {
        key: value
      },
      types: ['int/string']
    }

    @return: null
    */
    deleteDataTable = async (body) => {
        let [conditionKeys, conditionValues] = this.getConditionsWithTypes(body.data, body.types)
        await this.db.removeDataInTable(body.columnName, conditionKeys, conditionValues);
    }
}