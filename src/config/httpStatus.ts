export function sendSuccess(res: any, data: any, message = "Operación exitosa", status = 200) {
  return res.status(status).send({ message, data })
}
