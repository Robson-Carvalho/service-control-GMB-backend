import {
  Entity,
  ObjectIdColumn,
  Column,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeUpdate,
} from "typeorm";
import { Length, IsEnum, IsNotEmpty } from "class-validator";
import { v4 as uuidv4 } from "uuid";

export enum OrderStatusRole {
  PENDING = "Pendente",
  REJECTED = "Negado",
  ATTENDED = "Atendido",
}

@Entity("orders")
export class Order {
  @ObjectIdColumn()
  _id: string = "";

  @Column()
  @Length(5, 255)
  content: string = "";

  @Column()
  @IsNotEmpty()
  userID: string = "";

  @Column()
  @IsNotEmpty()
  inhabitantID: string = "";

  @Column({
    type: "enum",
    enum: OrderStatusRole,
    default: OrderStatusRole.PENDING,
  })
  @IsEnum(OrderStatusRole)
  status: OrderStatusRole = OrderStatusRole.PENDING;

  @CreateDateColumn()
  date: Date = new Date();

  @UpdateDateColumn()
  date_update: Date = new Date();

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }

  @BeforeUpdate()
  updateDate() {
    this.date_update = new Date();
  }
}
