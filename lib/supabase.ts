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

        return {
          data: {
            user: payload.user,
            session: payload,
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
    await new Promise((resolve) => setTimeout(resolve, 600))

    const mockUser: SupabaseAuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: trimmedEmail,
      user_metadata: { email: trimmedEmail },
    }

    return {
      data: {
        user: mockUser,
        session: {
          access_token: `mock_jwt_${Date.now()}`,
          token_type: 'bearer',
          user: mockUser,
        },
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

        return {
          data: {
            user: payload.user,
            session: payload.session || null,
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
    await new Promise((resolve) => setTimeout(resolve, 600))

    const mockUser: SupabaseAuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email: trimmedEmail,
      user_metadata: options?.data || {},
    }

    return {
      data: {
        user: mockUser,
        session: {
          access_token: `mock_jwt_${Date.now()}`,
          token_type: 'bearer',
          user: mockUser,
        },
      },
      error: null,
    }
  }

  async signOut(): Promise<{ error: null }> {
    return { error: null }
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

  async insert<T = any>(
    records: Record<string, any>[] | Record<string, any>
  ): Promise<{ data: T | null; error: { message: string } | null }> {
    const recordList = Array.isArray(records) ? records : [records]

    if (this.url && this.anonKey) {
      try {
        const response = await fetch(`${this.url}/rest/v1/${this.table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.anonKey,
            Authorization: `Bearer ${this.anonKey}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(recordList),
        })

        if (!response.ok) {
          const errPayload = await response.json().catch(() => null)
          return {
            data: null,
            error: {
              message:
                errPayload?.message ||
                errPayload?.error_description ||
                `Failed to insert into ${this.table} (${response.status})`,
            },
          }
        }

        const data = await response.json()
        return { data, error: null }
      } catch (err: any) {
        return {
          data: null,
          error: {
            message: err?.message || 'Network error inserting record into Supabase.',
          },
        }
      }
    }

    // Fallback simulation when Supabase credentials are not initialized
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockInserted = recordList.map((rec, i) => ({
      id: `issue_${Date.now()}_${i}`,
      created_at: new Date().toISOString(),
      ...rec,
    }))

    return {
      data: (Array.isArray(records) ? mockInserted : mockInserted[0]) as unknown as T,
      error: null,
    }
  }

  async select<T = any>(
    query = '*'
  ): Promise<{ data: T | null; error: { message: string } | null }> {
    if (this.url && this.anonKey) {
      try {
        const response = await fetch(
          `${this.url}/rest/v1/${this.table}?select=${encodeURIComponent(query)}`,
          {
            method: 'GET',
            headers: {
              apikey: this.anonKey,
              Authorization: `Bearer ${this.anonKey}`,
            },
          }
        )

        if (!response.ok) {
          const errPayload = await response.json().catch(() => null)
          return {
            data: null,
            error: {
              message: errPayload?.message || `Failed to fetch from ${this.table}`,
            },
          }
        }

        const data = await response.json()
        return { data, error: null }
      } catch (err: any) {
        return {
          data: null,
          error: {
            message: err?.message || 'Network error querying Supabase.',
          },
        }
      }
    }

    return { data: [] as unknown as T, error: null }
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
