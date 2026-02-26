import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('invoice_entity')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'file_name', type: 'character varying' })
  fileName: string

  @Column({ name: 'client', type: 'character varying' })
  client: string

  @Column({ name: 'month', type: 'character varying' })
  month: string

  @Column({ name: 'energy_consume', type: 'int' })
  energyConsume: number

  @Column({ name: 'energy_compensated', type: 'int' })
  energyCompensated: number

  @Column({ name: 'total_value_without_gd', type: 'int' })
  totalValueWithoutGd: number

  @Column({ name: 'economy_gd', type: 'int' })
  economyGd: number
}
