import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({example: 'user@mail.com'})
    readonly value: string
    @ApiProperty({example: '123456'})
    readonly description: string
}
