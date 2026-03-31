import { ProductDTO } from '../classTDO/ProductDTO'
import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

test.describe('Homework 11 -> Product API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/products' // base endpoint URL
  const AUTH = { 'X-API-Key': 'my-secret-api-key' } // correct API
  const nonAuth = { 'X-API-Key': 'my-incorrect-api-key' } // incorrect API
  const nonId = '-1' // incorrect product id
  let newProductDTO: ProductDTO // variable to use TBO, created inside beforeEach and delete inside afterEach
  const updatedDTO = new ProductDTO(0, 'order987', 909, null) // TBO used for PUT requests

  // Creating TBO before each test and use it inside test if needed
  test.beforeEach(async ({ request }) => {
    newProductDTO = new ProductDTO(0, 'order123', 303, '2026-03-23T18:04:11.285Z')
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: newProductDTO,
    })
    newProductDTO = await createResponse.json()
  })

  // Deleting created TBO after each test to clean up DB
  test.afterEach(async ({ request }) => {
    await request.delete(`${BaseEndpointURL}/${newProductDTO.id}`, {
      headers: AUTH,
    })
  })

  test('200 GET /products - check API returns array with length >= 1', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: AUTH,
    })
    const responseBody: ProductDTO[] = await response.json()
    expect(response.status()).toBe(StatusCodes.OK)
    expect(responseBody.length).toBeDefined()
    expect(responseBody.length).toBeGreaterThanOrEqual(1)
  })

  test('401 GET /products - check API returns with incorrect API', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: nonAuth,
    })
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })

  test('200 POST /products - check product creation', async ({ request }) => {
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: newProductDTO,
    })
    const createResponseBody: ProductDTO = await createResponse.json()
    expect(createResponse.status()).toBe(StatusCodes.OK)
    expect(createResponseBody.id).toBeGreaterThan(0)
    expect(createResponseBody.name).toBe(newProductDTO.name)
    expect(createResponseBody.price).toBe(newProductDTO.price)
    expect(createResponseBody.createdAt).toBeDefined()

    // Cleanup after test
    const deleteRequest = await request.delete(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    expect(deleteRequest.status()).toBe(StatusCodes.NO_CONTENT)
  })

  test('400 POST /products - check product creation with empty body', async ({ request }) => {
    const createProductDTO = {}
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: createProductDTO,
    })
    expect(createResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('200 GET /products/{id} - check product search by id', async ({ request }) => {
    const searchResponse = await request.get(`${BaseEndpointURL}/${newProductDTO.id}`, {
      headers: AUTH,
    })
    const searchResponseBody: ProductDTO = await searchResponse.json()
    expect(searchResponse.status()).toBe(StatusCodes.OK)
    expect.soft(searchResponseBody.id).toBe(newProductDTO.id)
    expect.soft(searchResponseBody.name).toBe(newProductDTO.name)
    expect.soft(searchResponseBody.price).toBe(newProductDTO.price)
    expect.soft(searchResponseBody.createdAt).toBeDefined()
  })

  test('400 GET /products/{id} - check product search by incorrect id', async ({ request }) => {
    const searchResponse = await request.get(`${BaseEndpointURL}/${nonId}`, {
      headers: AUTH,
    })
    expect(searchResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('200 PUT /products{id} - update product by id', async ({ request }) => {
    const updateResponse = await request.put(`${BaseEndpointURL}/${newProductDTO.id}`, {
      headers: AUTH,
      data: updatedDTO,
    })
    const updateResponseBody: ProductDTO = await updateResponse.json()
    expect(updateResponse.status()).toBe(StatusCodes.OK)
    expect(updateResponseBody.id).toBeGreaterThan(0)
    expect(updateResponseBody.id).toBe(newProductDTO.id)
    expect(updateResponseBody.name).toBe(updatedDTO.name)
    expect(updateResponseBody.name).not.toBe(newProductDTO.name)
    expect(updateResponseBody.price).toBe(updatedDTO.price)
    expect(updateResponseBody.price).not.toBe(newProductDTO.price)
    expect(updateResponseBody.createdAt).toBeDefined()
  })

  test('400 PUT /products{id} - update product by incorrect id', async ({ request }) => {
    const updateResponse = await request.put(`${BaseEndpointURL}/${nonId}`, {
      headers: AUTH,
      data: updatedDTO,
    })
    expect(updateResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('400 DELETE /products{id} - check not existing product deletion', async ({ request }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/${nonId}`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('204 DELETE /products{id} - check product deletion', async ({ request }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/${newProductDTO.id}`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT)
  })
})
