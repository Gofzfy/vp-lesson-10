import { expect, test } from '@playwright/test'
import { LoginTDO } from '../src/dto/LoginTDO'

test.describe('Login API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/login/student'

  test('Incorrect login request', async ({ request }) => {
    const loginResponse = await request.post(BaseEndpointURL, {
      data: LoginTDO.generateIncorrectPair(),
    })
    expect(loginResponse.status()).toBe(401)
  })

  test('Correct login request', async ({ request }) => {
    console.log(LoginTDO.generateCorrectPait())
    const loginResponse = await request.post(BaseEndpointURL, {
      data: LoginTDO.generateCorrectPait(),
    })

    const token = await loginResponse.text()
    expect(loginResponse.status()).toBe(200)
    expect(token.length).toBeGreaterThan(0)
  })
})
