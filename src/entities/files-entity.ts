import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('files_entity')
export class FilesEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'file_name', type: 'character varying' })
  fileName: string

  @Column({ name: 'client', type: 'character varying' })
  client: string

  @Column({ name: 'month', type: 'character varying' })
  month: string
}
