export function convertStringToDate(str: string): Date {
  const dict = {
    jan: 0,
    fev: 1,
    mar: 2,
    abr: 3,
    mai: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    set: 8,
    out: 9,
    nov: 10,
    dez: 11,
  }

  const [m, y] = str.toLowerCase().split('/')
  const year = parseInt(y)
  const month = dict[m]

  const a = new Date(year, month, 1)
  console.log(str, a)
  return a
}
