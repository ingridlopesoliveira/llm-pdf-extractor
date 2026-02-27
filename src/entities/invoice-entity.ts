import { ClientEntity } from 'src/entities/client-entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('invoice_entity')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'file_name', type: 'character varying' })
  fileName: string

  @Column({ name: 'client_id', type: 'int8', nullable: true })
  clientId: number

  @Column({ name: 'month', type: 'character varying' })
  month: string

  @Column({ name: 'energy_consume', type: 'int' })
  energyConsume: number

  @Column({ name: 'energy_compensated', type: 'int' })
  energyCompensated: number

  @Column({ name: 'total_value_without_gd', type: 'float' })
  totalValueWithoutGd: number

  @Column({ name: 'economy_gd', type: 'float' })
  economyGd: number

  @ManyToOne(() => ClientEntity, (client) => client.clientNumber)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity
}
