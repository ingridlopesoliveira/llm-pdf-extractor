export type Invoice = {
  fileName: string
  cliente: string
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
