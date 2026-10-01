export interface SupabaseAuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, any>
  role?: string
}

export interface SupabaseAuthSession {
  access_token: string
  token_type: string
  user: SupabaseAuthUser
}

export interface SupabaseAuthError {
  message: string
  status?: number
}

export interface SupabaseAuthResponse<T = { user: SupabaseAuthUser; session: SupabaseAuthSession }> {
  data: T | null
  error: SupabaseAuthError | null
}

class SupabaseAuthClient {
  private url?: string
  private anonKey?: string

  constructor(url?: string, anonKey?: string) {
    this.url = url
    this.anonKey = anonKey
  }

  async signInWithPassword({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<SupabaseAuthResponse> {
    const trimmedEmail = email?.trim() ?? ''
    const trimmedPassword = password?.trim() ?? ''

    if (!trimmedEmail || !trimmedPassword) {
      return {
        data: null,
        error: { message: 'Please provide both email and password.' },
      }
    }

    // If Supabase environment is provided, attempt REST API authentication
    if (this.url && this.anonKey) {
      try {
        const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.anonKey,
            Authorization: `Bearer ${this.anonKey}`,
          },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
        })

        const payload = await response.json()
        if (!response.ok) {
          return {
            data: null,
            error: {
              message:
                payload.error_description ||
                payload.msg ||
                payload.message ||
                'Invalid email or password.',
            },
          }
        }

        const sessionData = payload.session || payload
        if (typeof window !== 'undefined' && sessionData) {
          try {
            localStorage.setItem('cleansync_session', JSON.stringify(sessionData))
          } catch {}
        }

        return {
          data: {
            user: payload.user,
            session: sessionData,
          },
          error: null,
        }
      } catch (err: any) {
        return {
          data: null,
          error: {
            message: err?.message || 'Network error connecting to Supabase auth service.',
          },
        }
      }
    }

    // Fallback simulation when Supabase credentials are not initialized
    await new Promise((resolve) => setTimeout(resolve, 300))

    const lowerEmail = trimmedEmail.toLowerCase()
    const isGov = lowerEmail.endsWith('@gov.in') || lowerEmail.endsWith('@cleansync.gov')
    const mockUser: SupabaseAuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: trimmedEmail,
      role: isGov ? 'admin' : 'citizen',
      user_metadata: { email: trimmedEmail, role: isGov ? 'admin' : 'citizen' },
    }

    const mockSession: SupabaseAuthSession = {
      access_token: `mock_jwt_${Date.now()}`,
      token_type: 'bearer',
      user: mockUser,
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cleansync_session', JSON.stringify(mockSession))
      } catch {}
    }

    return {
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    }
  }

  async signUp({
    email,
    password,
    options,
  }: {
    email: string
    password: string
    options?: { data?: Record<string, any> }
  }): Promise<SupabaseAuthResponse<{ user: SupabaseAuthUser; session: SupabaseAuthSession | null }>> {
    const trimmedEmail = email?.trim() ?? ''
    const trimmedPassword = password?.trim() ?? ''

    if (!trimmedEmail || !trimmedPassword) {
      return {
        data: null,
        error: { message: 'Email and password are required.' },
      }
    }

    if (this.url && this.anonKey) {
      try {
        const response = await fetch(`${this.url}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.anonKey,
            Authorization: `Bearer ${this.anonKey}`,
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
            data: options?.data,
          }),
        })

        const payload = await response.json()
        if (!response.ok) {
          return {
            data: null,
            error: {
              message:
                payload.error_description ||
                payload.msg ||
                payload.message ||
                'Signup failed. Please try again.',
            },
          }
        }

        const sessionData = payload.session || null
        if (typeof window !== 'undefined' && sessionData) {
          try {
            localStorage.setItem('cleansync_session', JSON.stringify(sessionData))
          } catch {}
        }

        return {
          data: {
            user: payload.user,
            session: sessionData,
          },
          error: null,
        }
      } catch (err: any) {
        return {
          data: null,
          error: {
            message: err?.message || 'Network error connecting to Supabase auth service.',
          },
        }
      }
    }

    // Fallback simulation
    await new Promise((resolve) => setTimeout(resolve, 300))

    const mockUser: SupabaseAuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: trimmedEmail,
      user_metadata: options?.data || {},
    }

    const mockSession: SupabaseAuthSession = {
      access_token: `mock_jwt_${Date.now()}`,
      token_type: 'bearer',
      user: mockUser,
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cleansync_session', JSON.stringify(mockSession))
      } catch {}
    }

    return {
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    }
  }

  async getSession(): Promise<{ data: { session: SupabaseAuthSession | null }; error: null }> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cleansync_session') || localStorage.getItem('supabase_session')
        if (stored) {
          return { data: { session: JSON.parse(stored) }, error: null }
        }
      } catch {}
    }
    return { data: { session: null }, error: null }
  }

  async getUser(): Promise<{ data: { user: SupabaseAuthUser | null }; error: null }> {
    const { data } = await this.getSession()
    return { data: { user: data.session?.user || null }, error: null }
  }

  async signOut(): Promise<{ error: null }> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cleansync_session')
        localStorage.removeItem('cleansync_admin_auth')
        localStorage.removeItem('cleansync_user_role')
        localStorage.removeItem('supabase_session')
        localStorage.removeItem('cleansync_user')
        document.cookie = 'cleansync_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        document.cookie = 'cleansync_admin=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      } catch {}
    }
    return { error: null }
  }
}

import { INITIAL_TICKETS } from './admin-data'

// In-memory fallback store initialized with default issues
const getInitialIssues = () => [...INITIAL_TICKETS]

let inMemoryIssuesStore: any[] = getInitialIssues()

export class SupabaseQueryBuilder<T = any> implements PromiseLike<{ data: T | null; error: { message: string } | null }> {
  private url?: string
  private anonKey?: string
  private table: string
  private method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  private selectQuery?: string
  private orderColumn?: string
  private orderAscending = true
  private filters: { column: string; operator: string; value: any }[] = []
  private body?: any

  constructor(
    table: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url?: string,
    anonKey?: string,
    body?: any
  ) {
    this.table = table
    this.method = method
    this.url = url
    this.anonKey = anonKey
    this.body = body
  }

  select(query = '*') {
    this.selectQuery = query
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderColumn = column
    this.orderAscending = options?.ascending ?? true
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: 'eq', value })
    return this
  }

  async execute(): Promise<{ data: T | null; error: { message: string } | null }> {
    if (this.url && this.anonKey) {
      try {
        let endpoint = `${this.url}/rest/v1/${this.table}`
        const params = new URLSearchParams()
        if (this.selectQuery) {
          params.set('select', this.selectQuery)
        }
        if (this.orderColumn) {
          params.set('order', `${this.orderColumn}.${this.orderAscending ? 'asc' : 'desc'}`)
        }
        for (const f of this.filters) {
          params.set(f.column, `${f.operator}.${f.value}`)
        }

        const queryString = params.toString()
        if (queryString) {
          endpoint += `?${queryString}`
        }

        const headers: Record<string, string> = {
          apikey: this.anonKey,
          Authorization: `Bearer ${this.anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }

        const res = await fetch(endpoint, {
          method: this.method,
          headers,
          body: this.body ? JSON.stringify(this.body) : undefined,
        })

        if (!res.ok) {
          const errPayload = await res.json().catch(() => null)
          return {
            data: null,
            error: {
              message:
                errPayload?.message ||
                errPayload?.error_description ||
                `Supabase error (${res.status})`,
            },
          }
        }

        const data = await res.json().catch(() => null)
        return { data: data as T, error: null }
      } catch (err: any) {
        // Fallback on network or auth errors
      }
    }

    // Fallback simulation when Supabase credentials are unconfigured or offline
    await new Promise((r) => setTimeout(r, 60))

    if (this.table === 'issues') {
      if (this.method === 'POST') {
        const records = Array.isArray(this.body) ? this.body : [this.body]
        const newItems = records.map((rec: any, i: number) => {
          const genId = `ISS-${Math.floor(1285 + inMemoryIssuesStore.length + i)}`
          return {
            id: rec.id || genId,
            ticket_id: rec.ticket_id || rec.id || genId,
            title: rec.title || rec.category || 'Civic Issue',
            category: rec.category || 'Illegal Dumping',
            description: rec.description || 'Reported via CleanSync Citizen App',
            location: rec.location || 'Sector 4 Market',
            ward: rec.ward || 'Ward 4',
            status: rec.status || 'Pending',
            latitude: rec.latitude || 26.8467,
            longitude: rec.longitude || 80.9462,
            priority: rec.priority || 'Medium',
            image_url: rec.image_url || null,
            created_at: rec.created_at || new Date().toISOString(),
            reportedAt: rec.created_at || new Date().toISOString(),
          }
        })
        inMemoryIssuesStore.unshift(...newItems)
        return { data: (Array.isArray(this.body) ? newItems : newItems[0]) as unknown as T, error: null }
      }

      if (this.method === 'PATCH') {
        inMemoryIssuesStore = inMemoryIssuesStore.map((item) => {
          const matches = this.filters.every(
            (f) => String(item[f.column]) === String(f.value) || (f.column === 'id' && String(item.ticket_id) === String(f.value))
          )
          if (matches) {
            return { ...item, ...this.body }
          }
          return item
        })
        return { data: inMemoryIssuesStore as unknown as T, error: null }
      }

      if (this.method === 'GET') {
        let result = [...inMemoryIssuesStore]
        for (const f of this.filters) {
          result = result.filter(
            (item) => String(item[f.column]) === String(f.value) || (f.column === 'id' && String(item.ticket_id) === String(f.value))
          )
        }
        if (this.orderColumn) {
          result.sort((a, b) => {
            const valA = a[this.orderColumn!] || ''
            const valB = b[this.orderColumn!] || ''
            if (valA < valB) return this.orderAscending ? -1 : 1
            if (valA > valB) return this.orderAscending ? 1 : -1
            return 0
          })
        }
        return { data: result as unknown as T, error: null }
      }
    }

    return { data: [] as unknown as T, error: null }
  }

  then<TResult1 = { data: T | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

class SupabaseTableClient {
  private url?: string
  private anonKey?: string
  private table: string

  constructor(table: string, url?: string, anonKey?: string) {
    this.table = table
    this.url = url
    this.anonKey = anonKey
  }

  select<T = any>(query = '*') {
    const builder = new SupabaseQueryBuilder<T>(this.table, 'GET', this.url, this.anonKey)
    return builder.select(query)
  }

  insert<T = any>(records: Record<string, any>[] | Record<string, any>) {
    return new SupabaseQueryBuilder<T>(this.table, 'POST', this.url, this.anonKey, records)
  }

  update<T = any>(updates: Record<string, any>) {
    return new SupabaseQueryBuilder<T>(this.table, 'PATCH', this.url, this.anonKey, updates)
  }
}

export const supabase = {
  auth: new SupabaseAuthClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  from: (table: string) =>
    new SupabaseTableClient(
      table,
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
}
