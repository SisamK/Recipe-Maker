import { useState } from "react";
import { RECIPES } from "./recipes";

type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  tags: string[];
};

export default function RecipeMaker() {
  const [userInput, setUserInput] = useState("");
  const [matchingRecipes, setMatchingRecipes] = useState<Recipe[]>([]);

  function findBestMatchingRecipes() {
    const availableIngredients = userInput
      .toLowerCase()
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (availableIngredients.length === 0) {
      setMatchingRecipes([]);
      return;
    }

    const scoredRecipes = RECIPES.map((recipe) => {
      const matchCount = recipe.ingredients.reduce((count, ingredient) => {
        return availableIngredients.includes(ingredient.toLowerCase())
          ? count + 1
          : count;
      }, 0);

      return { recipe, matchCount };
    });

    const maxMatchCount = Math.max(...scoredRecipes.map((r) => r.matchCount));

    if (maxMatchCount === 0) {
      setMatchingRecipes([]);
      return;
    }

    const bestMatches = scoredRecipes
      .filter((r) => r.matchCount === maxMatchCount)
      .map((r) => r.recipe);

    setMatchingRecipes(bestMatches);
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#e25822", marginBottom: 20 }}>
        🍳 Recipe Maker
      </h1>
      <textarea
        placeholder="Enter ingredients you have (comma separated)"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          borderRadius: 8,
          border: "2px solid #e25822",
          resize: "none",
          marginBottom: 12,
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={findBestMatchingRecipes}
        disabled={!userInput.trim()}
        style={{
          backgroundColor: userInput.trim() ? "#e25822" : "#f0a26b",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: 8,
          fontWeight: "bold",
          cursor: userInput.trim() ? "pointer" : "not-allowed",
          width: "100%",
          fontSize: 18,
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => {
          if (userInput.trim()) (e.target as HTMLButtonElement).style.backgroundColor = "#c34d18";
        }}
        onMouseLeave={(e) => {
          if (userInput.trim()) (e.target as HTMLButtonElement).style.backgroundColor = "#e25822";
        }}
      >
        Make Recipe
      </button>

      <h2 style={{ marginTop: 40, borderBottom: "2px solid #e25822", paddingBottom: 6, color: "#b34710" }}>
        You Can Make
      </h2>

      {matchingRecipes.length === 0 ? (
  <p style={{ fontStyle: "italic", color: "darkblue", marginTop: 20 }}>
    No matching recipes found.
  </p>
) : (
  matchingRecipes.map((recipe) => (
    <div
      key={recipe.id}
      style={{
        backgroundColor: "#fff3e0",
        marginTop: 24,
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
        color: "darkblue",  // Add this here to color text
      }}
    >
      <h3 style={{ color: "#d35400" }}>{recipe.title}</h3>
      <p style={{ fontWeight: "600", marginBottom: 12 }}>
        Cook Time: <span style={{ fontWeight: "normal" }}>{recipe.cookTime}</span>
      </p>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 250 }}>
          <h4 style={{ borderBottom: "1px solid #d35400", paddingBottom: 4 }}>
            Ingredients
          </h4>
          <ul style={{ marginTop: 8, lineHeight: 1.6 }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>• {ing}</li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: 250 }}>
          <h4 style={{ borderBottom: "1px solid #d35400", paddingBottom: 4 }}>Steps</h4>
          <ol style={{ marginTop: 8, lineHeight: 1.6 }}>
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  ))
)}

    </div>
  );
}
