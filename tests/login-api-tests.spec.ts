import { expect, test } from '@playwright/test'
import { LoginDTO } from '../src/dto/LoginDTO'

test.describe('Login API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/login/student'

  test('Incorrect login request', async ({ request }) => {
    const loginResponse = await request.post(BaseEndpointURL, {
      data: LoginDTO.generateIncorrectPair(),
    })
    expect(loginResponse.status()).toBe(401)
  })

  test('Correct login request', async ({ request }) => {
    console.log(LoginDTO.generateCorrectPair())
    const loginResponse = await request.post(BaseEndpointURL, {
      data: LoginDTO.generateCorrectPair(),
    })

    const token = await loginResponse.text()
    expect(loginResponse.status()).toBe(200)
    expect(token.length).toBeGreaterThan(0)
  })
})
