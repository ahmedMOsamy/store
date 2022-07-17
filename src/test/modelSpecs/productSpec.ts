import { Product, ProductStore, BaseProduct } from '../../models/product'

const storeProducts = new ProductStore()

describe('Product Model', () => {
  const product: BaseProduct = {
    name: 'panadol 500 tab',
    price: 16
  }

  async function createProduct(product: BaseProduct) {
    return storeProducts.create(product)
  }

  async function deleteProduct(id: number) {
    return storeProducts.deleteProduct(id)
  }

  it('should have an index method', () => {
    expect(storeProducts.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(storeProducts.read).toBeDefined()
  })

  it('should have a add method', () => {
    expect(storeProducts.create).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(storeProducts.deleteProduct).toBeDefined()
  })

  it('add method should add a product', async () => {
    const createdProduct: Product = await createProduct(product)

    expect(createdProduct).toEqual({
      id: createdProduct.id,
      ...product
    })

    await deleteProduct(createdProduct.id)
  })

  it('index method should return a list of products', async () => {
    const createdProduct: Product = await createProduct(product)
    const productList = await storeProducts.index()

    expect(productList).toEqual([createdProduct])

    await deleteProduct(createdProduct.id)
  })

  it('show method should return the correct product', async () => {
    const createdProduct: Product = await createProduct(product)
    const productInDb = await storeProducts.read(createdProduct.id)

    expect(productInDb).toEqual(createdProduct)

    await deleteProduct(createdProduct.id)
  })

  it('update method should update the product', async () => {
    const createdProduct: Product = await createProduct(product)
    const newProductData: BaseProduct = {
      name: 'adol 500 tab',
      price: 12
    }

    const { name, price } = await storeProducts.update(createdProduct.id, newProductData)

    expect(name).toEqual(newProductData.name)
    expect(price).toEqual(newProductData.price)

    await deleteProduct(createdProduct.id)
  })

  it('delete method should remove the product', async () => {
    const createdProduct: Product = await createProduct(product)

    await deleteProduct(createdProduct.id)

    const productList = await storeProducts.index()

    expect(productList).toEqual([])
  })
})
