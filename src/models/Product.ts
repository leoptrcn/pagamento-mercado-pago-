import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instaces/mysql';
export interface User extends Model {
    id: number;
    name: string;
}

export const User = sequelize.define<User>("user", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'user',
    timestamps: false
});

