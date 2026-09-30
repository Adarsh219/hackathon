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

export const supabase = {
  auth: new SupabaseAuthClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
}
