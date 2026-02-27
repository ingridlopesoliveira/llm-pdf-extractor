import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('client_entity')
export class ClientEntity {
  @Column({ name: 'client_name', type: 'character varying' })
  clientName: string

  @PrimaryColumn({ name: 'client_number', type: 'int8' })
  clientNumber: number
}
