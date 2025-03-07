import { sequelize } from "@/database/db";
import { DataTypes, Model, Optional } from "sequelize";

interface ITokenAttributes {
  id: number;
  user: number;
  refreshToken: string;
}


export class Token
  extends Model<ITokenAttributes, Optional<ITokenAttributes, "id">>
  implements ITokenAttributes
{
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
    tableName: "tokens",
  },
);
