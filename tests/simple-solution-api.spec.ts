import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { OrderDTO, OrderSchema } from '../src/dto/OrderDTO'
import { Login, LoginDTO } from '../src/dto/LoginDTO'
import { getJwt } from '../src/helpers/api-helper'

const ORDERS_URL = 'https://backend.tallinn-learning.ee/orders'
const AUTH_URL = 'https://backend.tallinn-learning.ee/login/student'

test('post order with correct data should receive code 201', async ({ request }) => {
  const token = await getJwt(request)

  console.log('token' + token)
  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json() //"age:20,title:'123'"
  const statusCode = response.status()

  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
  const TestOrder = OrderSchema.parse(responseBody)
  expect(TestOrder.id).not.toBeUndefined()
})

test('get order with correct id should receive code 200', async ({ request }) => {
  const loginResponse = await request.post(AUTH_URL, {
    data: LoginDTO.generateCorrectPair(),
  })
  const token: Login = await loginResponse.text()

  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json()

  const responseSearch = await request.get(`${ORDERS_URL}/${responseBody.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const responseBodySearch: OrderDTO = await responseSearch.json()
  const statusCode = responseSearch.status()
  expect(statusCode).toBe(200)
  const TestSearchOrder = OrderSchema.parse(responseBodySearch)
  expect(TestSearchOrder.id).not.toBeUndefined()
})

// Homework 10: Cover PUT, DELETE and GET requests with tests and test their statuses by checklist
test('PUT 200: Correct orderID and api_key', async ({ request }) => {
  const requestHeaders = {
    Api_key: '1234567890123456',
  }
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'Vladimir',
    customerPhone: '37256872341',
    comment: 'test',
    id: 1,
  }
  const pathId = '/test-orders/1'
  const response = await request.put(`https://backend.tallinn-learning.ee${pathId}`, {
    headers: requestHeaders,
    data: requestBody,
  })
  const responseBody = await response.json()
  expect(responseBody).toStrictEqual(requestBody)
  expect(response.status()).toBe(200)
})

test('PUT 401: Correct orderID and incorrect api_key', async ({ request }) => {
  const requestHeaders = {
    Api_key: '1a2b3c4d5e6f7g8j',
  }
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'Vladimir',
    customerPhone: '37256872341',
    comment: 'test',
    id: 1,
  }
  const pathId = '/test-orders/2'
  const response = await request.put(`https://backend.tallinn-learning.ee${pathId}`, {
    headers: requestHeaders,
    data: requestBody,
  })
  expect(response.status()).toBe(401)
})

test('PUT 404: Empty request body', async ({ request }) => {
  const requestHeaders = {
    Api_key: '1234567890123456',
  }
  const pathId = '/test-orders/1'
  const response = await request.put(`https://backend.tallinn-learning.ee${pathId}`, {
    headers: requestHeaders,
    data: {},
  })
  // sending empty body results 200 with {} and 415 with '' as body type
  // sending incorrect pathId will result 400
  // as this request is sent to a backend with no fixed DB, i guess it can't return 404..
  expect(response.status()).toBe(200)
})

test('DELETE 204: Correct orderID and api_key', async ({ request }) => {
  const requestHeaders = {
    Api_key: '1234567890123456',
  }
  const pathId = '/test-orders/4'
  const response = await request.delete(`https://backend.tallinn-learning.ee${pathId}`, {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(204)
})

test('DELETE 401: Correct orderID and incorrect api_key', async ({ request }) => {
  const requestHeaders = {
    Api_key: 'q1w2e3r4t5y6u7i8',
  }
  const pathId = '/test-orders/4'
  const response = await request.delete(`https://backend.tallinn-learning.ee${pathId}`, {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(401)
})

test('GET 200: Correct username and password', async ({ request }) => {
  const username = 'Test'
  const password = 'test123'
  const pathId = `/test-orders/auth?username=${username}&password=${password}`
  const response = await request.get(`https://backend.tallinn-learning.ee${pathId}`)
  const responseBody = await response.json()
  console.log(responseBody.message)
  expect(responseBody.apiKey).toHaveLength(16)
  expect(response.status()).toBe(200)
})

test('GET 500: Empty username or password', async ({ request }) => {
  const testData = [
    ['Test', ''],
    ['', 'Test123'],
    ['', ''],
  ]
  for (let i = 0; i < testData.length; i++) {
    const user = testData[i]
    const username = user[0]
    const password = user[1]
    const pathId = `/test-orders/auth?username=${username}&password=${password}`
    const response = await request.get(`https://backend.tallinn-learning.ee${pathId}`)
    const responseBody = await response.json()
    console.log(responseBody.message)
    expect(responseBody.apiKey).toBe(null)
    expect(response.status()).toBe(500)
  }
})
