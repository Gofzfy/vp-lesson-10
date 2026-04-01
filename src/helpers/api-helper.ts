import { LoginDTO } from '../dto/LoginDTO'
import { APIRequestContext } from 'playwright'
import { OrderDTO } from '../dto/OrderDTO'
import { expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

const AUTH_URL = 'https://backend.tallinn-learning.ee'
const LOGIN_PATH = '/login/student'
const ORDER_CREATE_PATH = '/orders'

export async function getJwt(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(AUTH_URL + LOGIN_PATH, {
    data: LoginDTO.generateCorrectPair(),
  })
  return await loginResponse.text()
}

export async function createOrder(request: APIRequestContext, jwt: string): Promise<OrderDTO> {
  const response = await request.post(AUTH_URL + ORDER_CREATE_PATH, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json()
  expect(response.status()).toBe(StatusCodes.OK)
  return responseBody
}

export async function getOrderById(request: APIRequestContext, jwt: string, id: number): Promise<OrderDTO> {
  const responseSearch = await request.get(`${AUTH_URL}${ORDER_CREATE_PATH}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  const responseBodySearch: OrderDTO = await responseSearch.json()
  expect(responseSearch.status()).toBe(StatusCodes.OK)
  return responseBodySearch
}
