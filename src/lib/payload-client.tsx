import { useContext, createContext, ReactNode } from 'react'

// Payload client interface
export interface IPayloadClient {
  find: (options: FindOptions) => Promise<FindResult>
  create: (options: CreateOptions) => Promise<Document>
  update: (options: UpdateOptions) => Promise<Document>
  delete: (options: DeleteOptions) => Promise<void>
  findByID: (options: FindByIDOptions) => Promise<Document | null>
  login: (email: string, password: string) => Promise<{ user: Document; token: string }>
  logout: () => Promise<void>
  me: () => Promise<Document | null>
  getCollections: () => Promise<string[]>
  getCollection: (
    collection: string,
    options?: Omit<FindOptions, 'collection'>,
  ) => Promise<FindResult>
  getUsers: (options?: Omit<FindOptions, 'collection'>) => Promise<FindResult>
  getMedia: (options?: Omit<FindOptions, 'collection'>) => Promise<FindResult>
}

export interface WhereCondition {
  contains?: string
  [key: string]: unknown
}

export interface WhereClause {
  or?: WhereCondition[]
  [key: string]: unknown
}

export interface FindOptions {
  collection: string
  page?: number
  limit?: number
  where?: WhereClause
  sort?: string
  depth?: number
}

export interface Document {
  id: string
  [key: string]: unknown
}

export interface FindResult {
  docs: Document[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface CreateOptions {
  collection: string
  data: Record<string, any>
}

export interface UpdateOptions {
  collection: string
  id: string
  data: Record<string, any>
}

export interface DeleteOptions {
  collection: string
  id: string
}

export interface FindByIDOptions {
  collection: string
  id: string
  depth?: number
}

// Mock implementation for development/testing
class MockPayloadClient implements IPayloadClient {
  private mockData = new Map<string, any[]>()

  constructor() {
    // Initialize with some mock data
    this.mockData.set('users', [
      { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() },
    ])

    this.mockData.set('posts', [
      { id: '1', title: 'First Post', content: 'This is the first post', createdAt: new Date() },
      { id: '2', title: 'Second Post', content: 'This is the second post', createdAt: new Date() },
    ])
  }

  async find(options: FindOptions): Promise<FindResult> {
    const { collection, page = 1, limit = 10, where = {}, sort } = options

    let docs = this.mockData.get(collection) || []

    // Apply basic filtering
    if (where && Object.keys(where).length > 0) {
      docs = docs.filter((doc) => {
        // Handle OR conditions for search
        if (where.or) {
          return where.or.some((condition: WhereCondition) => {
            return Object.entries(condition).some(([key, value]) => {
              if (value && typeof value === 'object' && 'contains' in value) {
                const whereValue = value as WhereCondition
                if (whereValue.contains) {
                  return doc[key]?.toLowerCase().includes(whereValue.contains.toLowerCase())
                }
              }
              return doc[key] === value
            })
          })
        }

        // Handle regular conditions
        return Object.entries(where).every(([key, value]) => {
          if (value && typeof value === 'object' && 'contains' in value) {
            const whereValue = value as WhereCondition
            if (whereValue.contains) {
              return doc[key]?.toLowerCase().includes(whereValue.contains.toLowerCase())
            }
          }
          return doc[key] === value
        })
      })
    }

    // Apply sorting
    if (sort) {
      const isDesc = sort.startsWith('-')
      const field = isDesc ? sort.substring(1) : sort

      docs.sort((a, b) => {
        const aVal = a[field]
        const bVal = b[field]
        let comparison = 0

        if (aVal < bVal) comparison = -1
        else if (aVal > bVal) comparison = 1
        else comparison = 0

        return isDesc ? -comparison : comparison
      })
    }

    // Apply pagination
    const totalDocs = docs.length
    const totalPages = Math.ceil(totalDocs / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDocs = docs.slice(startIndex, endIndex)

    return {
      docs: paginatedDocs,
      totalDocs,
      totalPages,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  }

  async create(options: CreateOptions): Promise<Document> {
    const { collection, data } = options
    const docs = this.mockData.get(collection) || []

    const newDoc = {
      id: `${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    docs.push(newDoc)
    this.mockData.set(collection, docs)

    return newDoc
  }

  async update(options: UpdateOptions): Promise<Document> {
    const { collection, id, data } = options
    const docs = this.mockData.get(collection) || []

    const index = docs.findIndex((doc) => doc.id === id)
    if (index === -1) {
      throw new Error(`Document with id ${id} not found in collection ${collection}`)
    }

    const updatedDoc = {
      ...docs[index],
      ...data,
      updatedAt: new Date(),
    }

    docs[index] = updatedDoc
    this.mockData.set(collection, docs)

    return updatedDoc
  }

  async delete(options: DeleteOptions): Promise<void> {
    const { collection, id } = options
    const docs = this.mockData.get(collection) || []

    const index = docs.findIndex((doc) => doc.id === id)
    if (index === -1) {
      throw new Error(`Document with id ${id} not found in collection ${collection}`)
    }

    docs.splice(index, 1)
    this.mockData.set(collection, docs)
  }

  async findByID(options: FindByIDOptions): Promise<Document | null> {
    const { collection, id } = options
    const docs = this.mockData.get(collection) || []

    const doc = docs.find((doc) => doc.id === id)
    if (!doc) {
      throw new Error(`Document with id ${id} not found in collection ${collection}`)
    }

    return doc
  }

  async login(email: string, password: string): Promise<{ user: Document; token: string }> {
    // Mock login implementation
    const users = this.mockData.get('users') || []
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    return {
      user,
      token: 'mock-jwt-token',
    }
  }

  async logout(): Promise<void> {
    // Mock logout implementation
    return Promise.resolve()
  }

  async me(): Promise<Document | null> {
    // Mock me implementation - return current user
    const users = this.mockData.get('users') || []
    return users[0] || null // Return first user as mock current user
  }

  async getCollections(): Promise<string[]> {
    // Return available collection names
    return Array.from(this.mockData.keys())
  }

  async getCollection(
    collection: string,
    options: Omit<FindOptions, 'collection'> = {},
  ): Promise<FindResult> {
    // Use the existing find method with collection-specific options
    return this.find({ collection, ...options })
  }

  async getUsers(options: Omit<FindOptions, 'collection'> = {}): Promise<FindResult> {
    // Get users collection with options
    return this.find({ collection: 'users', ...options })
  }

  async getMedia(options: Omit<FindOptions, 'collection'> = {}): Promise<FindResult> {
    // Get media collection with options
    return this.find({ collection: 'media', ...options })
  }
}

// Concrete PayloadClient class for instantiation
export class PayloadClient extends MockPayloadClient {
  constructor(serverUrl?: string) {
    super()
    // In a real implementation, this would connect to the actual Payload server
    // For now, we use the mock implementation
  }
}

// Context for Payload client
const PayloadContext = createContext<IPayloadClient | null>(null)

export function PayloadProvider({ children }: { children: ReactNode }) {
  const client = new PayloadClient()

  return <PayloadContext.Provider value={client}>{children}</PayloadContext.Provider>
}

export function usePayload(): IPayloadClient | null {
  return useContext(PayloadContext)
}
