import { Entity, ObjectIdColumn, Column, BeforeInsert } from "typeorm";
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from "class-validator";

import { v4 as uuidv4 } from "uuid";

export enum UserRole {
  BF = "Bolsa Família",
  CRAS = "Centro de Referência de Assistência Social",
  DEFAULT = "None",
}

@Entity("users")
export class User {
  @ObjectIdColumn()
  _id: string = "";

  @Column()
  @Length(5, 50)
  name: string = "";

  @Column({ unique: true })
  @IsEmail()
  email: string = "";

  @Column()
  @Length(6, 15)
  password: string = "";

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.BF,
  })
  userType: UserRole = UserRole.DEFAULT;

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
