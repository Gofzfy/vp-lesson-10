import { expect, test } from '@playwright/test'

import { OrderSchema } from '../src/dto/OrderDTO'
import { createOrder, getJwt, getOrderById } from '../src/helpers/api-helper'

// Homework 13: Part 1, creating and searching orders with api-helpers
test.describe('Homework 13: Part 1', () => {
  test('Create order with api-helper', async ({ request }) => {
    const createdOrder = await createOrder(request, await getJwt(request))
    const testOrder = OrderSchema.parse(createdOrder)

    expect(testOrder.id).toBeGreaterThan(1)
    expect(testOrder.id).not.toBeUndefined()
    console.log(testOrder)
  })

  test('Create order and search order by id with api-helper', async ({ request }) => {
    const createdOrder = await createOrder(request, await getJwt(request))
    const responseSearch = await getOrderById(request, await getJwt(request), createdOrder.id)
    const testSearchOrder = OrderSchema.parse(responseSearch)

    expect(testSearchOrder.id).not.toBeUndefined()
    expect(responseSearch.id).toBeGreaterThan(0)
    expect(responseSearch.id).toBe(createdOrder.id)
    expect(responseSearch.id).not.toBeUndefined()
    console.log(responseSearch)
  })
})
