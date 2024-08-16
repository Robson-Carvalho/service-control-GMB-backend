import { IsNotEmpty } from "class-validator";
import { BeforeInsert, Column, Entity, ObjectIdColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("communities")
export class Community {
  @ObjectIdColumn()
  _id: string = "";

  @Column()
  @IsNotEmpty()
  name: string = "";

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
