import { Entity, ObjectIdColumn, Column, BeforeInsert } from "typeorm";
import {
  Length,
  IsNotEmpty,
  ValidateNested,
  Validate,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isCpf", async: false })
class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean {
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const digits = cpf.split("").map(Number);
    const checkDigit = (digits: number[], length: number) => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += digits[i] * (length + 1 - i);
      }
      const result = (sum * 10) % 11;
      return result === 10 ? 0 : result;
    };

    const firstCheckDigit = checkDigit(digits, 9);
    if (firstCheckDigit !== digits[9]) return false;

    const secondCheckDigit = checkDigit(digits, 10);
    if (secondCheckDigit !== digits[10]) return false;

    return true;
  }

  defaultMessage(): string {
    return "Invalid CPF";
  }
}

class Address {
  @Column()
  @IsNotEmpty()
  @Length(3, 50)
  street: string = "";

  @Column()
  @IsNotEmpty()
  number: string = "";
}

@Entity("inhabitants")
export class Inhabitant {
  @ObjectIdColumn()
  _id: string = "";

  @Column()
  @Length(5, 50)
  name: string = "";

  @Column({ unique: true })
  @Length(11, 11)
  @IsNotEmpty()
  @IsString()
  @Validate(IsCpfConstraint)
  cpf: string = "";

  @Column()
  @Length(0, 14)
  numberPhone: string = "";

  @Column((type) => Address)
  @ValidateNested()
  @Type(() => Address)
  address: Address = new Address();

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
