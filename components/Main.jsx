import React from "react"
import ClaudeRecipe from "./ClaudeRecipe.jsx"
import IngredientList from "./IngredientList.jsx"
import { getRecipeFromMistral } from "../ai.js"


export default function Main() {

    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const recipeSection = React.useRef(null)
    
    React.useEffect(()=>{
        if(recipe && recipeSection.current){
            recipeSection.current.scrollIntoView({behavior: "smooth"})
        }
    }, [recipe])
    
    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown); 
    }


    const ingredientsListItems = ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            {ingredients.length > 0 && <IngredientList ingredients={ingredients} getRecipe={getRecipe}  ref={recipeSection}/>}
            {recipe &&  <ClaudeRecipe recipe = {recipe}/>}
        </main>
    )
}