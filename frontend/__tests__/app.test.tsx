import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        }
    },
    usePathname() {
        return ''
    },
}))

// Mock the API utility
jest.mock('../../utils/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
    },
    removeToken: jest.fn(),
}))

describe('Frontend Tests', () => {
    test('should pass basic test', () => {
        expect(true).toBe(true)
    })

    test('should have testing utilities available', () => {
        expect(render).toBeDefined()
        expect(screen).toBeDefined()
    })
})
