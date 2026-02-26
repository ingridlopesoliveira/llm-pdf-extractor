export type DashboardData = {
  energyConsume: number // Energia Elétrica kWh’ + ‘Energia SCEEE s/ICMS kWh’,
  energyCompensated: number // Energia Compensada GD I kWh’,
  totalValueWithoutGd: number //  ‘Energia Elétrica (R$)’ + ‘Energia SCEE s/ ICMS (R$)’ + ‘Contrib Ilum Publica Municipal (R$)’
  economyGd: number // Economia GD I (R$)
}
