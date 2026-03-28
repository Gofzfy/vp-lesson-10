import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(200)
})

test('post order with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
  // check that body.comment is string type
  expect(typeof responseBody.comment).toBe('string')
  // check that body.courierId is number type
  expect(typeof responseBody.courierId).toBe('number')
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
  const pathId = `/test-orders?username=${username}&password=${password}`
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
    const pathId = `/test-orders?username=${username}&password=${password}`
    const response = await request.get(`https://backend.tallinn-learning.ee${pathId}`)
    const responseBody = await response.json()
    console.log(responseBody.message)
    expect(responseBody.apiKey).toBe(null)
    expect(response.status()).toBe(500)
  }
})
