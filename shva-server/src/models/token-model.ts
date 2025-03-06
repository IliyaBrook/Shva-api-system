import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db';

interface ITokenAttributes {
  id: number;
  user: number;
  refreshToken: string;
}

interface ITokenCreationAttributes extends Optional<ITokenAttributes, 'id'> {}

export class Token extends Model<ITokenAttributes, ITokenCreationAttributes> implements ITokenAttributes {
  public id!: number;
  public user!: number;
  public refreshToken!: string;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tokens'
  }
);