import { User } from '@stackframe/stack';
import { v4 as uuid } from 'uuid';

/**
 * Fetches all users
 * @returns Promise resolving to an array of User items
 */
export async function getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
        resolve([
            {
                id: '1cf78e04-0350-4137-b2fe-7bc32002d648',
                displayName: 'Brandon'
            },
            {
                id: uuid(),
                displayName: 'Jared'
            }
        ] as User[])
    })
} 