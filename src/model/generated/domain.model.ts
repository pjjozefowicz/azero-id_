import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Owner} from "./owner.model"

@Entity_()
export class Domain {
    constructor(props?: Partial<Domain>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Owner, {nullable: true})
    owner!: Owner

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    registrationDate!: Date

    @Column_("timestamp with time zone", {nullable: false})
    expirationDate!: Date
}
