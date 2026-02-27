import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientDTO } from 'src/dtos/client/client.dto'
import { ClientEntity } from 'src/entities/client-entity'
import { Repository } from 'typeorm'

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async create(data: ClientDTO): Promise<ClientEntity> {
    const client = this.repository.create(data)
    return this.repository.save(client)
  }

  async findOneByClienteNumber(id: number): Promise<ClientEntity | null> {
    return this.repository.findOneBy({ clientNumber: id })
  }
}
