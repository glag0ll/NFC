import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Здесь будет логика сохранения в базу данных
    // и/или отправка уведомления
    
    console.log('Order received:', data)
    
    // Имитация обработки заказа
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    return NextResponse.json({ success: true, message: 'Заказ принят' })
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка обработки заказа' },
      { status: 500 }
    )
  }
}

