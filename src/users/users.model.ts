import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
interface UserCreationAttrs {
    email: string
    password: string
}
@Table({
    tableName: 'users'
})
export class User extends Model<User, UserCreationAttrs> { // второй дженерик - необходимые поля для создания екземпляра
    @ApiProperty({
        example: '1',
        description: 'уникальный индитификатор'
    })
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@mail.com'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string

    @ApiProperty({example: '123456'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string

    @ApiProperty({example: 'false'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean

    @ApiProperty({example: 'string', required:false})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string


    @BelongsToMany(()=>Role, ()=> UserRoles)
    roles: Role[]
}
