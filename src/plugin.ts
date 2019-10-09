import * as jwt from 'jsonwebtoken'
import { toPlainObject, toString, isEmpty } from 'lodash'
//@ts-ignore
import UserModel, { IUser } from 'entities/User'
//@ts-ignore
import RoleModel, { IRole } from 'entities/Role'
import {Crypto} from 'rapin/types/library/crypto'

export class User {
  public crypto: Crypto
  public token: string
  public userId: string
  public firstName: string
  public lastName: string
  public email: string
  public image: string
  public roleType: string
  public role: IRole
  constructor(registry) {
    this.crypto = registry.get('crypto')
    this.token = ''
    this.userId = ''
    this.firstName = ''
    this.lastName = ''
    this.email = ''
    this.image = ''
    this.roleType = ''
  }

  public async login(email: string, password: string, override = false): Promise<string|boolean> {
    const user = await UserModel.findOne({email}).exec()

    if(!user) {
      return false
    }

    let userInfo: IUser
    if(override) {
      userInfo = user
    } else {
      const passwordHash = this.crypto.getHashPassword(password, user.salt)

      userInfo = await UserModel.findOne(
        {email, password: passwordHash.hash, salt: passwordHash.salt}
      ).exec()
    }

    if (!isEmpty(userInfo)) {
      this.token = jwt.sign(toPlainObject(userInfo.toJSON()), process.env.SECRET_KEY, {
        expiresIn: 21600,
      })

      this.userId = userInfo.id
      this.firstName = userInfo.firstName
      this.lastName = userInfo.lastName
      this.email = userInfo.email
      this.image = userInfo.image
      this.roleType = userInfo.roleId
      this.role = await RoleModel.findById(userInfo.roleId).exec()

      return this.token
    } else {
      return false
    }
  }

  public async getToken(email: string, password: string, expiresIn = 21600): Promise<string|boolean> {
    const user = await UserModel.findOne({email}).exec()

    if(!user) {
      return false
    }

    const passwordHash = this.crypto.getHashPassword(password, user.salt)

    const userInfo: IUser = await UserModel.findOne(
      {email, password: passwordHash.hash, salt: passwordHash.salt}
    ).exec()

    if (!isEmpty(userInfo)) {
      const token = jwt.sign(toPlainObject(userInfo.toJSON()), process.env.SECRET_KEY, {
        expiresIn,
      })

      return token
    } else {
      return false
    }

  }

  public async verify(token: string, login = true): Promise<boolean> {
    try {
      const user = jwt.verify(token, toString(process.env.SECRET_KEY))
      const userInfo = await UserModel.findOne({email: user.email}).exec()
      if (userInfo) {
        if(login) {
          this.token = token
          this.userId = userInfo.id
          this.firstName = userInfo.firstName
          this.lastName = userInfo.lastName
          this.email = userInfo.email
          this.image = userInfo.image
          this.roleType = userInfo.roleId
          this.role = await RoleModel.findById(userInfo.roleId).exec()
        }

        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  public getId(): string {
    return this.userId
  }

  public getFirstName(): string {
    return this.firstName
  }

  public getLastName(): string {
    return this.lastName
  }

  public getEmail(): string {
    return this.email
  }

  public getImage(): string {
    return this.image
  }

  public getRoleType(): string {
    return this.roleType
  }

  public getRole(): IRole {
    return this.role
  }

  public isLogged(): boolean {
    return !!this.token
  }
}