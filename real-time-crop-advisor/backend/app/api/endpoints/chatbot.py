from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime
import os
import re
import httpx

router = APIRouter()

class MessageItem(BaseModel):
    sender: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[MessageItem]] = []

class ChatResponse(BaseModel):
    reply: str
    category: str
    suggestions: List[str]
    timestamp: str

# Detailed Agricultural Knowledge Engine for Intelligent Responses
KNOWLEDGE_BASE = {
    "crop_selection": {
        "keywords": ["crop", "plant", "grow", "kharif", "rabi", "zaid", "season", "sowing time", "seed"],
        "reply": "🌱 **Crop Selection & Sowing Advice:**\n\n"
                 "• **Kharif Season (June–Oct):** Paddy, Maize, Cotton, Soybean, Groundnut, Pigeon Pea.\n"
                 "• **Rabi Season (Oct–March):** Wheat, Mustard, Chickpea (Gram), Barley, Potato.\n"
                 "• **Zaid Season (March–June):** Watermelon, Cucumber, Muskmelon, Fodder crops.\n\n"
                 "💡 *Tip:* Select certified seeds treated with *Trichoderma viride* or *Thiram* to prevent seed-borne diseases.",
        "suggestions": ["How to treat seeds?", "Best fertilizer for Wheat", "Irrigation schedule for Paddy"]
    },
    "irrigation": {
        "keywords": ["water", "irrigate", "irrigation", "drip", "sprinkler", "moisture", "dry", "rain"],
        "reply": "💧 **Irrigation & Water Management:**\n\n"
                 "• **Drip Irrigation:** Ideal for cotton, sugarcane, fruits, and vegetables. Saves 40–60% water.\n"
                 "• **Sprinkler System:** Excellent for groundnut, pulses, and mustard on uneven lands.\n"
                 "• **Critical Stages for Watering:**\n"
                 "  - Wheat: Crown root initiation (21 days) & Flowering.\n"
                 "  - Paddy: Tillering and Panicle initiation.\n\n"
                 "💡 *Tip:* Avoid over-watering during early vegetative stages to promote deep root growth.",
        "suggestions": ["Subsidy on Drip Irrigation", "Soil moisture tips", "Weather forecast impact"]
    },
    "fertilizers": {
        "keywords": ["fertilizer", "npk", "urea", "dap", "manure", "compost", "nutrient", "soil health", "zinc", "potash"],
        "reply": "🧪 **Fertilizer & Soil Nutrition Guide:**\n\n"
                 "• **General NPK Ratio:** 4:2:1 (Nitrogen:Phosphorus:Potassium) balanced per soil test.\n"
                 "• **Basal Dose:** Apply full Phosphatic (DAP/SSP) and Potassic fertilizers at sowing time.\n"
                 "• **Nitrogen (Urea):** Apply in 2–3 split doses at vegetative growth & tillering.\n"
                 "• **Micronutrients:** Zinc Sulfate (25 kg/ha) prevents khaira disease in paddy.\n\n"
                 "💡 *Tip:* Always test your soil using the Soil Health Card scheme before heavy fertilizer application.",
        "suggestions": ["Organic compost recipes", "Symptoms of Zinc deficiency", "Soil test procedure"]
    },
    "pest_disease": {
        "keywords": ["pest", "disease", "insect", "fungus", "yellow", "spots", "caterpillar", "worm", "spray", "neem", "pesticide", "blight", "rust"],
        "reply": "🛡️ **Pest & Disease Management Advisory:**\n\n"
                 "• **Sucking Pests (Aphids/Whiteflies):** Spray Neem oil (10,000 PPM) at 5 ml/liter water, or Imidacloprid 17.8 SL.\n"
                 "• **Fungal Leaf Blight / Rust:** Spray Mancozeb 75% WP @ 2.5g/liter or Propiconazole.\n"
                 "• **Fall Armyworm (Maize/Cotton):** Use Pheromone traps (4-5 per acre) & Emamectin benzoate 5% SG.\n\n"
                 "💡 *Safety Note:* Wear protective gear and spray during calm morning or late evening hours.",
        "suggestions": ["Neem oil spray preparation", "Prevent yellow rust in wheat", "Pheromone traps setup"]
    },
    "weather": {
        "keywords": ["weather", "rain", "temperature", "climate", "frost", "heat", "storm", "monsoon"],
        "reply": "⛅ **Weather Impact Advisory:**\n\n"
                 "• **Heavy Rain Alert:** Ensure proper drainage in fields to avoid waterlogging and root rot.\n"
                 "• **Frost Protection:** Give light irrigation in the evening or create smoke along field borders.\n"
                 "• **High Heat/Dry Wind:** Use mulch (straw/leaves) to reduce soil moisture evaporation.\n\n"
                 "💡 *Tip:* Avoid spraying pesticides or chemical fertilizers just before predicted rainfall.",
        "suggestions": ["Irrigation after rain", "Mulching techniques", "Summer crop advice"]
    },
    "schemes": {
        "keywords": ["scheme", "government", "pm-kisan", "subsid", "pmfby", "loan", "insurance", "kcc", "card"],
        "reply": "🏛️ **Government Schemes & Financial Support:**\n\n"
                 "• **PM-KISAN:** Income support of ₹6,000/year in 3 equal installments.\n"
                 "• **PM Fasal Bima Yojana (PMFBY):** Crop insurance against natural calamities (1.5–2% premium).\n"
                 "• **Kisan Credit Card (KCC):** Subsidized farm credit up to ₹3 Lakh at low interest rates.\n"
                 "• **Subsidized Farm Machinery:** 40-50% subsidy under SMAM scheme for implements.",
        "suggestions": ["PM-KISAN status check", "KCC eligibility", "Crop insurance registration"]
    }
}

DEFAULT_REPLY = (
    "🌱 **Hello! I am your AI Farming Assistant.**\n\n"
    "I can help you with expert advice on:\n"
    "1. **Crop Selection & Sowing Schedules**\n"
    "2. **Irrigation & Water Management**\n"
    "3. **Fertilizer Ratios & Soil Health**\n"
    "4. **Pest & Disease Control**\n"
    "5. **Weather Warnings & Seasonal Tips**\n"
    "6. **Government Schemes & Subsidies**\n\n"
    "Please ask your question (e.g., *'What is the best fertilizer dose for wheat?'* or *'How to control yellow rust in paddy?'*)."
)

DEFAULT_SUGGESTIONS = [
    "Best crop for Kharif season",
    "Fertilizer dose for Wheat",
    "Drip irrigation benefits",
    "How to control sucking pests",
    "PM-KISAN scheme details"
]


async def query_llm_if_available(message: str) -> Optional[str]:
    """If OPENAI_API_KEY or GEMINI_API_KEY is configured in env, call external LLM safely."""
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    if openai_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {openai_key}"},
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {"role": "system", "content": "You are Farmogram AI, a friendly, practical, expert agricultural scientist advising Indian farmers on crops, sowing, soil, fertilizers, pest control, weather, and farm management. Keep answers clear, bulleted, actionable, and encouraging."},
                            {"role": "user", "content": message}
                        ],
                        "max_tokens": 400,
                        "temperature": 0.7
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass

    if gemini_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_key}"
                res = await client.post(
                    url,
                    json={
                        "contents": [{
                            "parts": [{"text": f"System prompt: You are Farmogram AI, an expert agricultural scientist advising farmers on crop choices, sowing, fertilizers, pest control, weather, and farming advice. Keep responses practical, well-formatted, concise, and bulleted.\n\nUser Question: {message}"}]
                        }]
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass

    return None


@router.post("/chat", response_model=ChatResponse)
async def chat_with_advisor(req: ChatRequest):
    user_msg = req.message.strip().lower()
    
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    timestamp_str = datetime.datetime.now().strftime("%I:%M %p")

    # Check external LLM first if API key present
    llm_reply = await query_llm_if_available(req.message)
    if llm_reply:
        return ChatResponse(
            reply=llm_reply,
            category="ai_generated",
            suggestions=["Tell me about crop rotation", "Fertilizer calculation", "Organic pesticides"],
            timestamp=timestamp_str
        )

    # Fallback: Expert Agricultural Knowledge Matching Engine
    best_match = None
    highest_score = 0

    for cat_name, cat_data in KNOWLEDGE_BASE.items():
        score = sum(1 for kw in cat_data["keywords"] if re.search(r'\b' + re.escape(kw) + r'\b', user_msg))
        if score > highest_score:
            highest_score = score
            best_match = (cat_name, cat_data)

    if best_match and highest_score > 0:
        cat_name, cat_data = best_match
        return ChatResponse(
            reply=cat_data["reply"],
            category=cat_name,
            suggestions=cat_data["suggestions"],
            timestamp=timestamp_str
        )

    # General greeting check
    if any(g in user_msg for g in ["hi", "hello", "hey", "namaste", "good morning", "help"]):
        return ChatResponse(
            reply="Namaste! 🙏 Welcome to **Farmogram AI Assistant**.\nHow can I help your farm today? Feel free to ask about crops, soil, pest remedies, fertilizers, or government schemes.",
            category="greeting",
            suggestions=DEFAULT_SUGGESTIONS,
            timestamp=timestamp_str
        )

    # Fallback default response with helpful tips
    return ChatResponse(
        reply="🌾 **Agricultural Advisory Support:**\n\n" +
              f"Thank you for asking about *'{req.message}'*.\n\n" +
              "To give you the best advice, could you clarify which crop (e.g. Wheat, Rice, Cotton, Tomato) or specific farming topic you are working on?\n\n" +
              "You can also select one of the suggested topics below:",
        category="general",
        suggestions=DEFAULT_SUGGESTIONS,
        timestamp=timestamp_str
    )
