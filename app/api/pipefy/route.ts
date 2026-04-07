import { NextRequest, NextResponse } from "next/server"

async function validateStoreId(storeId: string): Promise<{ isValid: boolean; storeData?: any }> {
  if (!process.env.WORDPRESS_API_URL) {
    return { isValid: false }
  }

  try {
    const response = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/api/v1/lojas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache'
    })

    if (!response.ok) {
      return { isValid: false }
    }

    const data = await response.json()
    
    if (data.success && data.lojas) {
      const storeIdStr = String(storeId)
      const store = data.lojas.find((s: any) => String(s.id) === storeIdStr)
      
      return { 
        isValid: !!store,
        storeData: store
      }
    }
    return { isValid: false }
  } catch (error) {
    return { isValid: false }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome,
      email,
      telefone,
      cidade,
      estado,
      interesse,
      expectativaInvestimento,
      lojaRegiao,
      lojaId,
      mensagem,
    } = body

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { error: "Nome, email e telefone são obrigatórios." },
        { status: 400 }
      )
    }

    let validatedStoreId = null

    if (lojaId) {
      const validation = await validateStoreId(lojaId)
      
      if (validation.isValid && validation.storeData) {
        validatedStoreId = parseInt(lojaId)
      }
    }

    if (process.env.WORDPRESS_API_URL) {
      const wpHeaders: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (process.env.WORDPRESS_AUTH_TOKEN) {
        wpHeaders["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`
      }

      const wpPayload: any = {
        nome,
        email,
        telefone,
        cidade,
        estado,
        interesse,
        expectativa_investimento: expectativaInvestimento,
        loja_regiao: lojaRegiao,
        mensagem,
      }

      if (validatedStoreId) {
        wpPayload.loja_id = validatedStoreId
      }

      try {
        const wpResponse = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/api/v1/leads`, {
          method: "POST",
          headers: wpHeaders,
          body: JSON.stringify(wpPayload),
        })

        if (!wpResponse.ok) {
          // Log error silently in production
        }
      } catch (wpError) {
        // Log error silently in production
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead registrado com sucesso",
      lojaId: validatedStoreId || null,
    })

  } catch (err) {
    return NextResponse.json(
      { 
        error: "Erro interno no servidor",
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}