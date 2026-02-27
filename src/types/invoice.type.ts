export type Invoice = {
  fileName: string
  numeroCliente: number
  nomeCliente: string
  mesReferencia: string
  energia: {
    kwh: number
    valor: number
  }
  energiaSceeeSIcms: {
    kwh: number
    valor: number
  }
  energiaCompensadaGdI: {
    kwh: number
    valor: number
  }
  ilumPublica: number
}
