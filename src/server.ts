import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import userRoutes from './handlers/user.route'
import productRoutes from './handlers/product.route'
import orderRoutes from './handlers/order.route'

const app: express.Application = express()

const address = '0.0.0.0:3000'

let port = 3000
if (process.env.ENV === 'test') {
  port = 3001
}

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!')
})
userRoutes(app)
productRoutes(app)
orderRoutes(app)

app.listen(port, function () {
  console.log(`starting app on: ${address}`)
})
export default app
