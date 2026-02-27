export class ClientDTO {
  clientName: string
  clientNumber: number

  constructor(clientName: string, clientNumber: number) {
    this.clientName = clientName
    this.clientNumber = clientNumber
  }
}
