import { sequelize } from '@/database/db'
import type { IUserModel } from '@/types/user'
import { DataTypes, Model, Optional } from 'sequelize';


type IUserCreationAttributes = Optional<IUserModel, 'id'>

export class User extends Model<IUserModel, IUserCreationAttributes> implements IUserModel {
  public id!: number;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
);