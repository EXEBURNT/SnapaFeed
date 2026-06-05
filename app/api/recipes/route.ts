import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ingredients = searchParams.get('ingredients')

  if (!ingredients) {
    return NextResponse.json({ error: 'No ingredients provided' }, { status: 400 })
  }

  try {
    const ingredientList = ingredients.split(',').map((i: string) => i.trim())
    const firstIngredient = ingredientList[0]

    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + encodeURIComponent(firstIngredient)
    )
    const data = await response.json()

    if (!data.meals) {
      return NextResponse.json([])
    }

    const meals = data.meals.slice(0, 6).map((meal: any) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      usedIngredientCount: 1,
      sourceUrl: 'https://www.themealdb.com/meal/' + meal.idMeal
    }))

    return NextResponse.json(meals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}
