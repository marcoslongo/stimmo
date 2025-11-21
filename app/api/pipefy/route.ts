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

    let pipefyCardId = null
    let validatedStoreId = null
    let storeData = null

    // Validar loja ID antes de enviar
    if (lojaId) {
      const validation = await validateStoreId(lojaId)
      
      if (validation.isValid && validation.storeData) {
        validatedStoreId = parseInt(lojaId)
        storeData = validation.storeData
      }
    }

    // Enviar para Pipefy
    if (process.env.PIPEFY_TOKEN && process.env.PIPEFY_PIPE_ID) {
      const query = `
        mutation {
          createCard(input: {
            pipe_id: "${process.env.PIPEFY_PIPE_ID}",
            fields_attributes: [
              { field_id: "nome", field_value: "${nome}" },
              { field_id: "email", field_value: "${email}" },
              { field_id: "telefone", field_value: "${telefone}" },
              { field_id: "cidade", field_value: "${cidade || ""}" },
              { field_id: "estado", field_value: "${estado || ""}" },
              { field_id: "interesse", field_value: "${interesse || ""}" },
              { field_id: "expectativa_de_investimento", field_value: "${expectativaInvestimento || ""}" },
              { field_id: "loja_regi_o", field_value: "${lojaRegiao || ""}" },
              ${validatedStoreId ? `{ field_id: "loja_id", field_value: "${validatedStoreId}" },` : ''}
              { field_id: "mensagem", field_value: "${mensagem || ""}" }
            ]
          }) {
            card {
              id
              title
            }
          }
        }
      `

      const pipefyHeaders: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (process.env.PIPEFY_TOKEN) {
        pipefyHeaders["Authorization"] = `Bearer ${process.env.PIPEFY_TOKEN}`
      }

      try {
        const pipefyResponse = await fetch("https://api.pipefy.com/graphql", {
          method: "POST",
          headers: pipefyHeaders,
          body: JSON.stringify({ query }),
        })

        const pipefyData = await pipefyResponse.json()
        
        if (pipefyData?.data?.createCard?.card?.id) {
          pipefyCardId = pipefyData.data.createCard.card.id
        }
      } catch (pipefyError) {
        // Log error silently in production
      }
    }

    // Enviar para WordPress
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

      if (pipefyCardId) {
        wpPayload.pipefy_card_id = pipefyCardId
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
      pipefyCardId: pipefyCardId || null,
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