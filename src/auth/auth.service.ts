import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {

    }

    async login(userDpo: CreateUserDto) {
        const user = await this.validateUser(userDpo)
        return this.generateToken(user)
    }

    async registration(userDpo: CreateUserDto) {
        const condidate = await this.usersService.getUserByEmail(userDpo.email)
        if (condidate) {
            throw new HttpException('пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDpo.password, 5)
        const user = await this.usersService.createUser({...userDpo, password: hashPassword})
        return this.generateToken(user)
    }

    async generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            role: user.roles
        }
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDpo: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(userDpo.email)
        if (!user) throw new UnauthorizedException({ message: 'user not found' })
        const passwordEquals = await bcrypt.compare(userDpo.password, user.password)
        if (!passwordEquals) throw new UnauthorizedException({ message: 'not equal password' })
        return user
    }
}
