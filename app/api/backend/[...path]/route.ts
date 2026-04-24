import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000'

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const body = await req.text()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Forward authorization header if present
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      headers['authorization'] = authHeader
    }

    const response = await fetch(`${BACKEND_URL}/${path}`, {
      method: 'POST',
      headers,
      body,
    })

    const responseData = await response.text()
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const queryString = req.nextUrl.search
    
    const headers: Record<string, string> = {}
    
    // Forward authorization header if present
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      headers['authorization'] = authHeader
    }

    const response = await fetch(`${BACKEND_URL}/${path}${queryString}`, {
      method: 'GET',
      headers,
    })

    const responseData = await response.text()
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const body = await req.text()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      headers['authorization'] = authHeader
    }

    const response = await fetch(`${BACKEND_URL}/${path}`, {
      method: 'PUT',
      headers,
      body,
    })

    const responseData = await response.text()
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    
    const headers: Record<string, string> = {}
    
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      headers['authorization'] = authHeader
    }

    const response = await fetch(`${BACKEND_URL}/${path}`, {
      method: 'DELETE',
      headers,
    })

    const responseData = await response.text()
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    return NextResponse.json(
      { error: 'Backend connection failed' },
      { status: 500 }
    )
  }
}
