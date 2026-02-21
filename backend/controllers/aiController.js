const { GoogleGenAI } = require('@google/genai');
const safeMapSuggest = (description) => {
    if (!description) return '';
    const s = description.toLowerCase();
    const rules = [
        ["pizza", "Food"],
        ["burger", "Food"],
        ["lunch", "Food"],
        ["dinner", "Food"],
        ["breakfast", "Food"],
        ["coffee", "Food"],
        ["tea", "Food"],
        ["snack", "Food"],
        ["food", "Food"],
        ["restaurant", "Food"],
        ["cafe", "Food"],
        ["delivery", "Food"],
        ["grocery", "Groceries"],
        ["groceries", "Groceries"],
        ["supermarket", "Groceries"],
        ["mart", "Groceries"],
        ["bus", "Transport"],
        ["train", "Transport"],
        ["uber", "Transport"],
        ["taxi", "Transport"],
        ["metro", "Transport"],
        ["auto", "Transport"],
        ["cab", "Transport"],
        ["ride", "Transport"],
        ["petrol", "Petrol"],
        ["gas", "Petrol"],
        ["fuel", "Petrol"],
        ["diesel", "Petrol"],
        ["rent", "Rent"],
        ["house rent", "Rent"],
        ["salary", "Salary"],
        ["payroll", "Salary"],
        ["income", "Salary"],
        ["bonus", "Salary"],
        ["electric", "Utilities"],
        ["electricity", "Utilities"],
        ["water", "Utilities"],
        ["internet", "Utilities"],
        ["mobile", "Utilities"],
        ["phone", "Utilities"],
        ["bill", "Utilities"],
        ["netflix", "Entertainment"],
        ["movie", "Entertainment"],
        ["spotify", "Entertainment"],
        ["game", "Entertainment"],
        ["youtube", "Entertainment"],
        ["concert", "Entertainment"],
        ["doctor", "Health"],
        ["pharmacy", "Health"],
        ["medicine", "Health"],
        ["hospital", "Health"],
        ["gym", "Health"],
        ["medical", "Health"],
        ["clinic", "Health"],
        ["misc", "Miscellaneous"],
        ["other", "Miscellaneous"],
    ];

    for (const [kw, cat] of rules) {
        if (s.includes(kw)) return cat;
    }

    if (/[0-9]{3,}/.test(s)) return 'Utilities';
    return 'Miscellaneous';
};

exports.suggestCategory = async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) return res.status(400).json({ error: 'Description required' });

        let suggestion = '';
        if (process.env.GENAI_API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });
                
                const prompt = `Choose one category from: Food, Groceries, Transport, Petrol, Utilities, Entertainment, Health, Rent, Salary, Miscellaneous.\nUser description: "${description}"\nReply with only the single category name.`;
                
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                });
                
                if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
                    suggestion = response.candidates[0].content.parts[0].text.trim();
                } else if (response.text) {
                    suggestion = response.text.trim();
                }
            } catch (err) {
                suggestion = safeMapSuggest(description);
            }
        } else {
            suggestion = safeMapSuggest(description);
        }

        return res.json({ category: suggestion });
    } catch (err) {
        console.error('suggestCategory error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};
